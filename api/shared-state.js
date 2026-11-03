const crypto = require("node:crypto");

const SHARED_STATE_KEY = "graficalc-global";
const SERVICE_ORDER_SEQUENCE_PREFIX = "graficalc-os-sequence-";
const FALLBACK_SUPABASE_URL = "https://abiwcbjqlffgnrfenvwf.supabase.co";

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

async function readSharedState() {
  const rows = await supabaseRequest(
    `/shared_app_state?state_key=eq.${encodeURIComponent(SHARED_STATE_KEY)}&select=payload,updated_at&limit=1`,
    { method: "GET" }
  );

  const row = Array.isArray(rows) ? rows[0] : null;
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

async function writeSharedState(payload) {
  if (!Array.isArray(payload.state?.serviceOrders)) {
    const current = await readSharedState();
    if (Array.isArray(current.payload?.state?.serviceOrders)) {
      payload = {
        ...payload,
        state: { ...payload.state, serviceOrders: current.payload.state.serviceOrders },
      };
    }
  }
  const updatedAt = new Date().toISOString();
  await supabaseRequest("/shared_app_state", {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({
      state_key: SHARED_STATE_KEY,
      payload,
      updated_at: updatedAt,
    }),
  });

  return {
    exists: true,
    payload,
    updatedAt,
  };
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
    return jsonResponse(await readSharedState());
  }

  if (request.method === "POST") {
    const body = await readRequestBody(request);
    if (body?.action === "verify_config_access") return verifyConfigAccess(body);
    if (body?.action === "reserve_service_order_number" && typeof body.quoteId === "string" && body.quoteId.length > 0 && body.quoteId.length <= 200) {
      return jsonResponse({ number: await reserveServiceOrderNumber(body.quoteId) });
    }
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
