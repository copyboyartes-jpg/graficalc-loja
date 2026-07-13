const HTML_FALLBACK = "/index.html";
const SHARED_STATE_KEY = "graficalc-global";

let schemaPromise = null;

function isAssetRequest(pathname) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

async function fetchAsset(env, request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
}

function withCacheHeaders(response, cacheControl) {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", cacheControl);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

async function ensureSchema(env) {
  if (!env.DB) {
    throw new Error("D1 binding ausente.");
  }

  if (!schemaPromise) {
    schemaPromise = env.DB.batch([
      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS shared_app_state (
          state_key TEXT PRIMARY KEY,
          payload TEXT NOT NULL,
          updated_at TEXT NOT NULL
        )
      `),
      env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS shared_app_state_updated_at_idx
        ON shared_app_state (updated_at)
      `),
    ]);
  }

  await schemaPromise;
}

async function readSharedState(env) {
  await ensureSchema(env);
  const row = await env.DB.prepare(`
    SELECT payload, updated_at
    FROM shared_app_state
    WHERE state_key = ?
  `).bind(SHARED_STATE_KEY).first();

  if (!row) {
    return {
      exists: false,
      payload: null,
      updatedAt: null,
    };
  }

  return {
    exists: true,
    payload: JSON.parse(row.payload),
    updatedAt: row.updated_at,
  };
}

async function writeSharedState(env, payload) {
  await ensureSchema(env);
  const updatedAt = new Date().toISOString();
  const serialized = JSON.stringify(payload);

  await env.DB.prepare(`
    INSERT INTO shared_app_state (state_key, payload, updated_at)
    VALUES (?, ?, ?)
    ON CONFLICT(state_key) DO UPDATE SET
      payload = excluded.payload,
      updated_at = excluded.updated_at
  `).bind(SHARED_STATE_KEY, serialized, updatedAt).run();

  return {
    exists: true,
    payload,
    updatedAt,
  };
}

async function handleSharedState(request, env) {
  if (request.method === "GET") {
    return jsonResponse(await readSharedState(env));
  }

  if (request.method === "PUT") {
    const body = await request.json();
    if (!body || typeof body !== "object" || !body.state || !body.config) {
      return jsonResponse({ error: "Payload inválido." }, 400);
    }
    return jsonResponse(await writeSharedState(env, body));
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        Allow: "GET, PUT, OPTIONS",
      },
    });
  }

  return jsonResponse({ error: "Método não permitido." }, 405);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/shared-state") {
      try {
        return await handleSharedState(request, env);
      } catch (error) {
        return jsonResponse(
          {
            error: "Não foi possível acessar a base compartilhada.",
            detail: error instanceof Error ? error.message : "Erro desconhecido.",
          },
          500
        );
      }
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const directResponse = await fetchAsset(env, request, url.pathname);
    if (directResponse.status !== 404) {
      if (url.pathname === "/" || url.pathname.endsWith(".html")) {
        return withCacheHeaders(directResponse, "no-store");
      }
      return directResponse;
    }

    if (isAssetRequest(url.pathname)) {
      return directResponse;
    }

    const fallbackResponse = await fetchAsset(env, request, HTML_FALLBACK);
    if (fallbackResponse.status !== 404) {
      return withCacheHeaders(fallbackResponse, "no-store");
    }

    return new Response("Not found", { status: 404 });
  },
};
