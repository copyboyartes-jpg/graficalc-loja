const crypto = require("node:crypto");
const { promisify } = require("node:util");

const SHARED_STATE_KEY = "graficalc-global";
const TEAM_STATE_KEY = "graficalc-team";
const COUNTER_SALES_STATE_KEY = "graficalc-counter-sales";
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
      number: original.number,
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

async function validateNewServiceOrders(existingOrders, incomingOrders) {
  const current = Array.isArray(existingOrders) ? existingOrders : [];
  const proposed = Array.isArray(incomingOrders) ? incomingOrders : [];
  const currentIds = new Set(current.map((order) => String(order.id)));
  const usedNumbers = new Set(current.map((order) => String(order.number)));
  const usedQuotes = new Set(current.map((order) => String(order.quoteId)));
  for (const order of proposed) {
    if (currentIds.has(String(order.id))) continue;
    const match = String(order.number || "").match(/^(\d{5,})-(\d{4})$/);
    const quoteId = String(order.quoteId || "");
    if (!match || !quoteId || usedNumbers.has(order.number) || usedQuotes.has(quoteId)) {
      requestError(409, "A O.S. precisa de um numero unico reservado na sequencia geral.");
    }
    const number = Number(match[1]);
    const row = await readStateRow(`${SERVICE_ORDER_SEQUENCE_PREFIX}${match[2]}`);
    if (!Number.isSafeInteger(number) || row?.payload?.quotes?.[quoteId] !== number) {
      requestError(409, "Reserve o numero da O.S. na sequencia geral antes de salvar.");
    }
    usedNumbers.add(order.number);
    usedQuotes.add(quoteId);
  }
}

async function writeSharedState(payload) {
  const result = await updateStateRow(SHARED_STATE_KEY, { state: {}, config: {} }, async (current) => {
    await validateNewServiceOrders(current.state?.serviceOrders, payload.state?.serviceOrders);
    return {
      ...payload,
      state: {
        ...payload.state,
        serviceOrders: keepProtectedServiceOrderFields(current.state?.serviceOrders, payload.state?.serviceOrders),
      },
    };
  });
  return { exists: true, ...result };
}

function getServiceOrderYear(date = new Date()) {
  return Number(new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(date));
}

async function reserveServiceOrderNumber(quoteId, year = getServiceOrderYear()) {
  const stateKey = `${SERVICE_ORDER_SEQUENCE_PREFIX}${year}`;
  const shared = await readSharedState();
  const highestSharedNumber = (Array.isArray(shared.payload?.state?.serviceOrders) ? shared.payload.state.serviceOrders : [])
    .reduce((highest, order) => {
      const match = String(order.number || "").match(/^(\d{5,})-(\d{4})$/);
      const number = match?.[2] === String(year) ? Number(match[1]) : 0;
      return Number.isSafeInteger(number) ? Math.max(highest, number) : highest;
    }, 0);
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
        body: JSON.stringify({ state_key: stateKey, payload: { lastNumber: highestSharedNumber, quotes: {} }, updated_at: new Date().toISOString() }),
      });
      continue;
    }

    const current = row.payload || {};
    if (Number.isSafeInteger(current.quotes?.[quoteId]) && current.quotes[quoteId] > 0) {
      return `${String(current.quotes[quoteId]).padStart(5, "0")}-${year}`;
    }
    const lastNumber = Math.max(Number.isSafeInteger(current.lastNumber) && current.lastNumber >= 0 ? current.lastNumber : 0, highestSharedNumber);
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

function businessDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value);
  const find = (type) => parts.find((part) => part.type === type)?.value;
  return `${find("year")}-${find("month")}-${find("day")}`;
}

function saleDate(value) {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? "" : businessDate(date);
}

function validDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T12:00:00Z`))
    && new Date(`${value}T12:00:00Z`).toISOString().slice(0, 10) === value;
}

function validMonth(value) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

function moneyCents(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.round(number * 100) : 0;
}

async function authenticateSales(body, members) {
  if (body.mode === "admin") {
    requireAdminPassword(body.password);
    return { mode: "admin", member: null };
  }
  const member = members.find((entry) => entry.id === body.memberId && entry.active !== false);
  if (!member || !(await memberPasswordMatches(String(body.password || ""), member))) {
    requestError(401, "Colaborador ou senha incorretos.");
  }
  return { mode: "member", member };
}

function collectSales(globalPayload, counterPayload, members) {
  const state = globalPayload?.state || {};
  const quotes = Array.isArray(state.quoteHistory) ? state.quoteHistory : [];
  const orders = Array.isArray(state.serviceOrders) ? state.serviceOrders : [];
  const approved = new Map(quotes.filter((quote) => quote.status === "Aprovado").map((quote) => [quote.id, quote]));
  const usedQuotes = new Set();
  const records = [];
  for (const order of orders) {
    if (order.quoteId && usedQuotes.has(order.quoteId)) continue;
    if (order.quoteId) usedQuotes.add(order.quoteId);
    const quote = approved.get(order.quoteId);
    const member = members.find((entry) => entry.id === order.createdByMemberId)
      || members.find((entry) => entry.name.toLocaleLowerCase("pt-BR") === String(order.createdByName || order.employeeName || "").toLocaleLowerCase("pt-BR"));
    const date = saleDate(quote?.approvedAt || order.createdAt || quote?.createdAt);
    const cents = moneyCents(quote?.total ?? order.total);
    if (!date || !cents) continue;
    records.push({ id: `os-${order.id}`, date, memberId: member?.id || "", source: "GrafiCalc", description: String(quote?.title || order.quoteTitle || "O.S."), clientName: String(quote?.clientName || order.clientName || ""), orderNumber: String(order.number || ""), amountCents: cents });
  }
  for (const quote of approved.values()) {
    if (usedQuotes.has(quote.id)) continue;
    const date = saleDate(quote.approvedAt || quote.createdAt);
    const cents = moneyCents(quote.total);
    if (!date || !cents) continue;
    records.push({ id: `quote-${quote.id}`, date, memberId: "", source: "GrafiCalc", description: String(quote.title || "Orçamento aprovado"), clientName: String(quote.clientName || ""), orderNumber: "", amountCents: cents });
  }
  for (const sale of Array.isArray(counterPayload?.sales) ? counterPayload.sales : []) {
    if (!validDate(sale.date) || !sale.memberId || !moneyCents(sale.amount)) continue;
    records.push({ id: sale.id, date: sale.date, memberId: sale.memberId, source: "Balcão", description: String(sale.description || "Venda de balcão"), clientName: String(sale.customerName || ""), orderNumber: "", amountCents: moneyCents(sale.amount), deletionRequest: sale.deletionRequest || null });
  }
  return records;
}

function summarizeSales(records) {
  const systemCents = records.filter((record) => record.source === "GrafiCalc").reduce((sum, record) => sum + record.amountCents, 0);
  const counterCents = records.filter((record) => record.source === "Balcão").reduce((sum, record) => sum + record.amountCents, 0);
  return { count: records.length, systemTotal: systemCents / 100, counterTotal: counterCents / 100, total: (systemCents + counterCents) / 100 };
}

async function getSalesDashboard(body) {
  const teamRow = await readStateRow(TEAM_STATE_KEY);
  const members = Array.isArray(teamRow?.payload?.members) ? teamRow.payload.members : [];
  const auth = await authenticateSales(body, members);
  const month = String(body.month || businessDate().slice(0, 7));
  if (!validMonth(month)) requestError(400, "Informe um mes valido.");
  const [globalRow, counterRow] = await Promise.all([readStateRow(SHARED_STATE_KEY), readStateRow(COUNTER_SALES_STATE_KEY)]);
  const records = collectSales(globalRow?.payload, counterRow?.payload, members)
    .filter((record) => auth.mode === "admin" || record.memberId === auth.member.id);
  const selectedRecords = records.filter((record) => record.date.startsWith(month))
    .sort((first, second) => second.date.localeCompare(first.date) || second.id.localeCompare(first.id));
  const currentMonth = businessDate().slice(0, 7);
  const [currentYear, currentNumber] = currentMonth.split("-").map(Number);
  const recentMonths = Array.from({ length: 12 }, (_, index) => new Date(Date.UTC(currentYear, currentNumber - 1 - index, 1)).toISOString().slice(0, 7));
  const months = [...new Set([month, ...recentMonths, ...records.map((record) => record.date.slice(0, 7))])]
    .sort().reverse().map((key) => ({ month: key, ...summarizeSales(records.filter((record) => record.date.startsWith(key))) }));
  const counterSales = Array.isArray(counterRow?.payload?.sales) ? counterRow.payload.sales : [];
  const pendingDeletionRequests = auth.mode === "admin" ? counterSales
    .filter((sale) => sale.deletionRequest?.status === "pending")
    .map((sale) => ({
      id: sale.id,
      date: sale.date,
      description: sale.description,
      customerName: sale.customerName || "",
      amount: sale.amount,
      requestedByName: sale.deletionRequest.requestedByName || members.find((member) => member.id === sale.memberId)?.name || "Colaborador",
      reason: sale.deletionRequest.reason,
      requestedAt: sale.deletionRequest.requestedAt,
    })).sort((first, second) => String(second.requestedAt).localeCompare(String(first.requestedAt))) : undefined;
  const reviewedDeletions = (Array.isArray(counterRow?.payload?.deletedSales) ? counterRow.payload.deletedSales : [])
    .filter((sale) => sale.date.startsWith(month) && (auth.mode === "admin" || sale.memberId === auth.member.id))
    .map((sale) => ({ id: sale.id, date: sale.date, description: sale.description, amount: sale.amount, requestedByName: sale.deletionRequest?.requestedByName || "Colaborador", reason: sale.deletionRequest?.reason || "", reviewedAt: sale.deletionRequest?.reviewedAt || "" }));
  return {
    mode: auth.mode,
    member: auth.member ? { id: auth.member.id, name: auth.member.name } : null,
    month,
    today: businessDate(),
    selected: summarizeSales(selectedRecords),
    months,
    entries: selectedRecords.map((record) => ({ ...record, amount: record.amountCents / 100, amountCents: undefined, memberName: members.find((member) => member.id === record.memberId)?.name || "Sem colaborador" })),
    pendingDeletionRequests,
    reviewedDeletions,
    team: auth.mode === "admin" ? [
      ...members.map((member) => ({ id: member.id, name: member.name, ...summarizeSales(selectedRecords.filter((record) => record.memberId === member.id)) })),
      { id: "", name: "Sem colaborador", ...summarizeSales(selectedRecords.filter((record) => !record.memberId)) },
    ] : undefined,
  };
}

async function addCounterSale(body) {
  const teamRow = await readStateRow(TEAM_STATE_KEY);
  const members = Array.isArray(teamRow?.payload?.members) ? teamRow.payload.members : [];
  const auth = await authenticateSales(body, members);
  if (auth.mode !== "member") requestError(403, "Entre como colaborador para lancar vendas de balcao.");
  const date = String(body.date || "");
  const description = String(body.description || "").trim();
  const customerName = String(body.customerName || "").trim();
  const amount = Number(body.amount);
  if (!validDate(date) || !description || description.length > 160 || customerName.length > 120
    || !Number.isFinite(amount) || amount <= 0 || amount > 1000000000 || Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001) {
    requestError(400, "Informe data, descricao e valor positivo com ate duas casas decimais.");
  }
  const sale = { id: crypto.randomUUID(), memberId: auth.member.id, date, description, customerName, amount: Math.round(amount * 100) / 100, createdAt: new Date().toISOString() };
  await updateStateRow(COUNTER_SALES_STATE_KEY, { sales: [] }, (current) => ({ ...current, sales: [...(Array.isArray(current.sales) ? current.sales : []), sale] }));
  return { id: sale.id };
}

async function requestCounterSaleDeletion(body) {
  const teamRow = await readStateRow(TEAM_STATE_KEY);
  const members = Array.isArray(teamRow?.payload?.members) ? teamRow.payload.members : [];
  const auth = await authenticateSales(body, members);
  if (auth.mode !== "member") requestError(403, "Entre como colaborador para solicitar a exclusao.");
  const saleId = String(body.saleId || "");
  const reason = String(body.reason || "").trim();
  if (reason.length < 3 || reason.length > 300) requestError(400, "Explique o motivo em 3 a 300 caracteres.");
  await updateStateRow(COUNTER_SALES_STATE_KEY, { sales: [] }, (current) => {
    const sales = Array.isArray(current.sales) ? current.sales : [];
    const index = sales.findIndex((entry) => entry.id === saleId);
    if (index < 0) requestError(404, "Venda de balcao nao encontrada.");
    const sale = sales[index];
    if (sale.memberId !== auth.member.id) requestError(403, "Esta venda pertence a outro colaborador.");
    if (sale.deletionRequest) requestError(409, "Esta venda ja teve uma solicitacao analisada ou pendente.");
    const next = [...sales];
    next[index] = { ...sale, deletionRequest: { status: "pending", reason, requestedByMemberId: auth.member.id, requestedByName: auth.member.name, requestedAt: new Date().toISOString() } };
    return { ...current, sales: next };
  });
  return { requested: true };
}

async function reviewCounterSaleDeletion(body) {
  requireAdminPassword(body.password);
  const saleId = String(body.saleId || "");
  const decision = String(body.decision || "");
  if (decision !== "delete" && decision !== "keep") requestError(400, "Escolha excluir ou manter a venda.");
  await updateStateRow(COUNTER_SALES_STATE_KEY, { sales: [] }, (current) => {
    const sales = Array.isArray(current.sales) ? current.sales : [];
    const index = sales.findIndex((entry) => entry.id === saleId);
    if (index < 0) requestError(404, "Venda de balcao nao encontrada.");
    const sale = sales[index];
    if (sale.deletionRequest?.status !== "pending") requestError(409, "Esta venda nao tem solicitacao pendente.");
    const reviewed = { ...sale, deletionRequest: { ...sale.deletionRequest, status: decision === "delete" ? "deleted" : "kept", reviewedAt: new Date().toISOString() } };
    if (decision === "delete") return {
      ...current,
      sales: sales.filter((entry) => entry.id !== saleId),
      deletedSales: [...(Array.isArray(current.deletedSales) ? current.deletedSales : []), reviewed],
    };
    const next = [...sales];
    next[index] = reviewed;
    return { ...current, sales: next };
  });
  return { decision };
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
    if (body?.action === "get_sales_dashboard") return jsonResponse(await getSalesDashboard(body));
    if (body?.action === "add_counter_sale") return jsonResponse(await addCounterSale(body));
    if (body?.action === "request_counter_sale_deletion") return jsonResponse(await requestCounterSaleDeletion(body));
    if (body?.action === "review_counter_sale_deletion") return jsonResponse(await reviewCounterSaleDeletion(body));
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
