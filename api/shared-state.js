const SHARED_STATE_KEY = "graficalc-global";

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

function getKvConfig() {
  const url = process.env.SUPABASE_URL;
  const token = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !token) {
    throw new Error("Base Supabase nao configurada.");
  }

  return { url: url.replace(/\/$/, ""), token };
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

async function handleSharedState(request) {
  if (request.method === "GET") {
    return jsonResponse(await readSharedState());
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
        Allow: "GET, PUT, OPTIONS",
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
