const crypto = require("node:crypto");
const { promisify } = require("node:util");

const SHARED_STATE_KEY = "graficalc-global";
const TEAM_STATE_KEY = "graficalc-team";
const SERVICE_ORDER_SEQUENCE_PREFIX = "graficalc-os-sequence-";
const FALLBACK_SUPABASE_URL = "https://abiwcbjqlffgnrfenvwf.supabase.co";
const scrypt = promisify(crypto.scrypt);
const PASSWORD_OPTIONS = { N: 1 << 15, r: 8, p: 3, maxmem: 64 * 1024 * 1024 };

function jsonResponse(body, status = 200) {
  return {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
    body,
  };
}

function looksLikeSupabaseUrl(value) {
  if (!value) {
    return false;
  }

  try {
    const parsed = new URL(String(value).trim());
    return parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co");
  } catch (error) {
    return false;
  }
}

function looksLikeSupabaseToken(value) {
  const token = String(value || "").trim();
  return token.startsWith("sb_publishable_") || token.startsWith("sb_secret_") || token.startsWith("eyJ");
}

function normalizeSupabaseUrl() {
  const candidates = [
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_REST_URL,
  ];

  const configuredUrl = candidates.find(looksLikeSupabaseUrl);
  return (configuredUrl || FALLBACK_SUPABASE_URL).replace(/\/$/, "");
}

function getSupabaseToken() {
  const directCandidates = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SECRET_KEY,
    process.env.SUPABASE_ANON_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  ];

  if (looksLikeSupabaseToken(process.env.SUPABASE_URL)) {
    directCandidates.push(process.env.SUPABASE_URL);
  }

  for (const [key, value] of Object.entries(process.env)) {
    if (looksLikeSupabaseToken(value)) {
      directCandidates.push(value);
    }
    if (looksLikeSupabaseToken(key)) {
      directCandidates.push(key);
    }
  }

  return directCandidates.map((value) => String(value || "").trim()).find(Boolean);
}

function getKvConfig() {
  const url = normalizeSupabaseUrl();
  const token = getSupabaseToken();

  if (!token) {
    throw new Error("Chave do Supabase nao configurada no Vercel.");
  }

  return { url, token };
}

async function supabaseRequest(path, options = {}) {
  const { url, token } = getKvConfig();
  const response = await fetch(`${url}/rest/v1${path}`, {
    ...options,
    headers: {
      apikey: token,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase respondeu ${response.status}. ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function readStateRow(stateKey) {
  const rows = await supabaseRequest(
    `/shared_app_state?state_key=eq.${encodeURIComponent(stateKey)}&select=payload,updated_at&limit=1`,
    { method: "GET" }
  );
  return Array.isArray(rows) ? rows[0] || null : null;
}

async function readSharedState() {
  const row = await readStateRow(SHARED_STATE_KEY);
  if (!row) {
    return {
      exists: false,
      payload: null,
      updatedAt: null,
    };
  }

  return {
    exists: true,
    payload: row.payload || null,
    updatedAt: row.updated_at || null,
  };
}

async function updateStateRow(stateKey, initialPayload, makePayload) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    let row = await readStateRow(stateKey);
    if (!row) {
      const inserted = await supabaseRequest("/shared_app_state", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
        body: JSON.stringify({ state_key: stateKey, payload: initialPayload, updated_at: new Date().toISOString() }),
      });
      row = Array.isArray(inserted) ? inserted[0] : null;
      if (!row) continue;
    }
    const nextPayload = await makePayload(row.payload || {});
    const priorTime = Date.parse(row.updated_at);
    const updatedAt = new Date(Math.max(Date.now(), Number.isFinite(priorTime) ? priorTime + 1 : 0)).toISOString();
    const updated = await supabaseRequest(
      `/shared_app_state?state_key=eq.${encodeURIComponent(stateKey)}&updated_at=eq.${encodeURIComponent(row.updated_at)}&select=payload`,
      { method: "PATCH", body: JSON.stringify({ payload: nextPayload, updated_at: updatedAt }) }
    );
    if (Array.isArray(updated) && updated.length === 1) return { payload: nextPayload, updatedAt };
  }
  throw new Error("A base compartilhada recebeu alteracoes simultaneas. Tente novamente.");
}

function keepProtectedServiceOrderFields(existingOrders, incomingOrders) {
  const current = Array.isArray(existingOrders) ? existingOrders : [];
  const proposed = Array.isArray(incomingOrders) ? incomingOrders : current;
  const originals = new Map(current.map((order) => [String(order.id), order]));
  const merged = proposed.map((order) => {
    const original = originals.get(String(order.id));
    return original ? {
      ...order,
      employeeName: original.employeeName,
      createdByMemberId: original.createdByMemberId || "",
      createdByName: original.createdByName || original.employeeName || "",
      assignedMemberId: original.assignedMemberId || "",
    } : order;
  });
  const included = new Set(merged.map((order) => String(order.id)));
  current.forEach((order) => { if (!included.has(String(order.id))) merged.push(order); });
  return merged;
}

async function writeSharedState(payload) {
  const result = await updateStateRow(SHARED_STATE_KEY, { state: {}, config: {} }, (current) => ({
    ...payload,
    state: {
      ...payload.state,
      serviceOrders: keepProtectedServiceOrderFields(current.state?.serviceOrders, payload.state?.serviceOrders),
    },
  }));
  return { exists: true, ...result };
}

function getServiceOrderYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(date));
}

async function reserveServiceOrderNumber(quoteId, year = getServiceOrderYear()) {
  const stateKey = `${SERVICE_ORDER_SEQUENCE_PREFIX}${year}`;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const rows = await supabaseRequest(
      `/shared_app_state?state_key=eq.${encodeURIComponent(stateKey)}&select=payload,updated_at&limit=1`,
      { method: "GET" }
    );
    const row = Array.isArray(rows) ? rows[0] : null;
    if (!row) {
      await supabaseRequest("/shared_app_state", {
        method: "POST",
        headers: { Prefer: "resolution=ignore-duplicates,return=representation" },
        body: JSON.stringify({ state_key: stateKey, payload: { lastNumber: 0, quotes: {} }, updated_at: new Date().toISOString() }),
      });
      continue;
    }

    const current = row.payload || {};
    if (Number.isSafeInteger(current.quotes?.[quoteId]) && current.quotes[quoteId] > 0) {
      return `${String(current.quotes[quoteId]).padStart(5, "0")}-${year}`;
    }
    const lastNumber = Number.isSafeInteger(current.lastNumber) && current.lastNumber >= 0 ? current.lastNumber : 0;
    const next = lastNumber + 1;
    const priorTime = Date.parse(row.updated_at);
    const updatedAt = new Date(Math.max(Date.now(), Number.isFinite(priorTime) ? priorTime + 1 : 0)).toISOString();
    const updated = await supabaseRequest(
      `/shared_app_state?state_key=eq.${encodeURIComponent(stateKey)}&updated_at=eq.${encodeURIComponent(row.updated_at)}&select=payload`,
      {
        method: "PATCH",
        body: JSON.stringify({ payload: { lastNumber: next, quotes: { ...current.quotes, [quoteId]: next } }, updated_at: updatedAt }),
      }
    );
    if (Array.isArray(updated) && updated.length === 1) return `${String(next).padStart(5, "0")}-${year}`;
  }
  throw new Error("Nao foi possivel reservar o numero da O.S. apos varias tentativas.");
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    let raw = "";
    request.on("data", (chunk) => {
      raw += chunk;
    });
    request.on("end", () => {
      if (!raw) {
        resolve(null);
        return;
      }

      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function passwordsMatch(received, expected) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);

  return receivedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
}

function requestError(status, message) {
  const error = new Error(message);
  error.status = status;
  throw error;
}

function requireAdminPassword(password) {
  const expected = String(process.env.CONFIG_ACCESS_PASSWORD || "");
  if (!expected) requestError(500, "Senha das configuracoes nao definida.");
  if (!passwordsMatch(String(password || ""), expected)) requestError(401, "Senha das configuracoes incorreta.");
}

function publicTeamMembers(payload) {
  return (Array.isArray(payload?.members) ? payload.members : []).map(({ id, name, active }) => ({ id, name, active: active !== false }));
}

async function hashMemberPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = await scrypt(password, Buffer.from(salt, "hex"), 32, PASSWORD_OPTIONS);
  return { salt, passwordHash: hash.toString("hex") };
}

async function memberPasswordMatches(password, member) {
  if (!member?.salt || !member?.passwordHash || !password) return false;
  const expected = Buffer.from(member.passwordHash, "hex");
  if (expected.length !== 32) return false;
  const received = await scrypt(password, Buffer.from(member.salt, "hex"), 32, PASSWORD_OPTIONS);
  return crypto.timingSafeEqual(received, expected);
}

async function readTeamMembers() {
  const row = await readStateRow(TEAM_STATE_KEY);
  return publicTeamMembers(row?.payload);
}

async function saveTeamMember(body) {
  requireAdminPassword(body.adminPassword);
  const name = String(body.name || "").trim().replace(/\s+/g, " ");
  const password = String(body.password || "");
  const memberId = String(body.memberId || "");
  if (!name || name.length > 80) requestError(400, "Informe um nome de ate 80 caracteres.");
  if ((!memberId && password.length < 8) || (password && password.length < 8) || Buffer.byteLength(password) > 256) {
    requestError(400, "A senha do colaborador precisa ter de 8 a 256 caracteres em UTF-8.");
  }
  const passwordFields = password ? await hashMemberPassword(password) : null;
  const newId = crypto.randomUUID();
  const result = await updateStateRow(TEAM_STATE_KEY, { members: [] }, (current) => {
    const members = Array.isArray(current.members) ? [...current.members] : [];
    const index = memberId ? members.findIndex((member) => member.id === memberId) : -1;
    if (memberId && index < 0) requestError(404, "Colaborador nao encontrado.");
    if (members.some((member, position) => position !== index && member.name.toLocaleLowerCase("pt-BR") === name.toLocaleLowerCase("pt-BR"))) {
      requestError(409, "Esse nome ja esta cadastrado na equipe.");
    }
    if (index >= 0) members[index] = { ...members[index], name, ...(passwordFields || {}) };
    else members.push({ id: newId, name, active: true, ...passwordFields });
    return { ...current, members };
  });
  return publicTeamMembers(result.payload);
}

async function toggleTeamMember(body) {
  requireAdminPassword(body.adminPassword);
  const memberId = String(body.memberId || "");
  const result = await updateStateRow(TEAM_STATE_KEY, { members: [] }, (current) => {
    const members = Array.isArray(current.members) ? [...current.members] : [];
    const index = members.findIndex((member) => member.id === memberId);
    if (index < 0) requestError(404, "Colaborador nao encontrado.");
    members[index] = { ...members[index], active: body.active === true };
    return { ...current, members };
  });
  return publicTeamMembers(result.payload);
}

async function changeServiceOrderEmployee(body) {
  const orderId = String(body.orderId || "");
  const memberId = String(body.memberId || "");
  const password = String(body.creatorPassword || "");
  if (!orderId || !memberId || !password) requestError(400, "Informe o novo responsavel e a senha de quem criou a O.S.");
  const teamRow = await readStateRow(TEAM_STATE_KEY);
  const members = Array.isArray(teamRow?.payload?.members) ? teamRow.payload.members : [];
  const target = members.find((member) => member.id === memberId && member.active !== false);
  if (!target) requestError(404, "Selecione um colaborador ativo da equipe.");
  let changedOrder;
  const result = await updateStateRow(SHARED_STATE_KEY, { state: {}, config: {} }, async (current) => {
    const orders = Array.isArray(current.state?.serviceOrders) ? [...current.state.serviceOrders] : [];
    const index = orders.findIndex((order) => order.id === orderId);
    if (index < 0) requestError(404, "O.S. nao encontrada na base compartilhada.");
    const order = orders[index];
    const originalName = String(order.createdByName || order.employeeName || "");
    const creator = members.find((member) => member.id === order.createdByMemberId)
      || members.find((member) => member.name.toLocaleLowerCase("pt-BR") === originalName.toLocaleLowerCase("pt-BR"));
    if (!creator) requestError(409, "Cadastre o responsavel original na equipe antes de alterar esta O.S.");
    if (!(await memberPasswordMatches(password, creator))) requestError(401, "Senha do responsavel original incorreta.");
    changedOrder = {
      ...order,
      createdByMemberId: order.createdByMemberId || creator.id,
      createdByName: originalName,
      assignedMemberId: target.id,
      employeeName: target.name,
      updatedAt: new Date().toISOString(),
    };
    orders[index] = changedOrder;
    return { ...current, state: { ...current.state, serviceOrders: orders } };
  });
  return { order: changedOrder, updatedAt: result.updatedAt };
}

function verifyConfigAccess(body) {
  const expectedPassword = String(process.env.CONFIG_ACCESS_PASSWORD || "");

  if (!expectedPassword) {
    return jsonResponse({ valid: false, error: "Senha de configuracao nao definida." }, 500);
  }

  const valid = passwordsMatch(String(body?.password || ""), expectedPassword);
  return jsonResponse({ valid }, valid ? 200 : 401);
}

async function handleSharedState(request) {
  if (request.method === "GET") {
    if (new URL(request.url || "/", "https://graficalc.local").searchParams.get("resource") === "team") {
      return jsonResponse({ members: await readTeamMembers() });
    }
    return jsonResponse(await readSharedState());
  }

  if (request.method === "POST") {
    const body = await readRequestBody(request);
    if (body?.action === "verify_config_access") return verifyConfigAccess(body);
    if (body?.action === "reserve_service_order_number" && typeof body.quoteId === "string" && body.quoteId.length > 0 && body.quoteId.length <= 200) {
      return jsonResponse({ number: await reserveServiceOrderNumber(body.quoteId) });
    }
    if (body?.action === "save_team_member") return jsonResponse({ members: await saveTeamMember(body) });
    if (body?.action === "toggle_team_member") return jsonResponse({ members: await toggleTeamMember(body) });
    if (body?.action === "change_os_employee") return jsonResponse(await changeServiceOrderEmployee(body));
    return jsonResponse({ error: "Payload invalido." }, 400);
  }

  if (request.method === "PUT") {
    const body = await readRequestBody(request);
    if (!body || typeof body !== "object" || !body.state || !body.config) {
      return jsonResponse({ error: "Payload invalido." }, 400);
    }
    return jsonResponse(await writeSharedState(body));
  }

  if (request.method === "OPTIONS") {
    return {
      status: 204,
      headers: {
        Allow: "GET, POST, PUT, OPTIONS",
      },
      body: null,
    };
  }

  return jsonResponse({ error: "Metodo nao permitido." }, 405);
}

function send(response, result) {
  Object.entries(result.headers || {}).forEach(([key, value]) => {
    response.setHeader(key, value);
  });
  response.statusCode = result.status || 200;
  if (result.body === null || typeof result.body === "undefined") {
    response.end();
    return;
  }
  response.end(JSON.stringify(result.body));
}

module.exports = async function handler(request, response) {
  try {
    send(response, await handleSharedState(request));
  } catch (error) {
    if (error?.status >= 400 && error.status < 500) {
      send(response, jsonResponse({ error: error.message }, error.status));
      return;
    }
    send(
      response,
      jsonResponse(
        {
          error: "Nao foi possivel acessar a base compartilhada.",
          detail: error instanceof Error ? error.message : "Erro desconhecido.",
        },
        500
      )
    );
  }
};
