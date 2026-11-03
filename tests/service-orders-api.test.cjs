const assert = require("node:assert/strict");
const { Readable } = require("node:stream");
const test = require("node:test");
const handler = require("../api/shared-state.js");

test("cliente antigo não apaga O.S. ao salvar o estado compartilhado", async () => {
  const priorToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priorFetch = global.fetch;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_test";
  const order = { id: "os-1", quoteId: "q-1", number: "OS-20261029-12345678" };
  let writtenPayload;
  global.fetch = async (_url, options) => {
    if (options.method === "GET") {
      return { ok: true, status: 200, json: async () => [{ payload: { state: { serviceOrders: [order] } }, updated_at: "2026-10-29" }] };
    }
    writtenPayload = JSON.parse(options.body).payload;
    return { ok: true, status: 200, json: async () => [] };
  };
  try {
    const request = Readable.from([JSON.stringify({ state: { clients: [], quoteHistory: [] }, config: {} })]);
    request.method = "PUT";
    let responseBody = "";
    const response = { statusCode: 0, setHeader() {}, end(value) { responseBody = value || ""; } };
    await handler(request, response);
    assert.equal(response.statusCode, 200);
    assert.equal(writtenPayload.state.serviceOrders[0].number, order.number);
    assert.equal(JSON.parse(responseBody).payload.state.serviceOrders[0].quoteId, "q-1");
  } finally {
    global.fetch = priorFetch;
    if (priorToken === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorToken;
  }
});

test("reserva números sequenciais mesmo com pedidos simultâneos e reutiliza o número do orçamento", async () => {
  const priorToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priorFetch = global.fetch;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_test";
  const database = new Map();
  let collisions = 0;
  global.fetch = async (url, options) => {
    const requestUrl = new URL(url);
    const key = requestUrl.searchParams.get("state_key")?.replace(/^eq\./, "");
    const response = (data) => ({ ok: true, status: 200, json: async () => data });
    if (options.method === "GET") return response(database.has(key) ? [structuredClone(database.get(key))] : []);
    if (options.method === "POST") {
      const entry = JSON.parse(options.body);
      if (!database.has(entry.state_key)) database.set(entry.state_key, entry);
      return response([]);
    }
    if (options.method === "PATCH") {
      const entry = database.get(key);
      const expected = requestUrl.searchParams.get("updated_at")?.replace(/^eq\./, "");
      if (entry.updated_at !== expected) {
        collisions += 1;
        return response([]);
      }
      Object.assign(entry, JSON.parse(options.body));
      return response([structuredClone(entry)]);
    }
    throw new Error(`Unexpected method: ${options.method}`);
  };

  async function reserve(quoteId) {
    const request = Readable.from([JSON.stringify({ action: "reserve_service_order_number", quoteId })]);
    request.method = "POST";
    const response = { statusCode: 0, setHeader() {}, end(value) { this.body = JSON.parse(value); } };
    await handler(request, response);
    assert.equal(response.statusCode, 200);
    return response.body.number;
  }

  try {
    const numbers = await Promise.all([reserve("quote-a"), reserve("quote-b")]);
    assert.deepEqual(numbers.map((number) => number.slice(0, 5)).sort(), ["00001", "00002"]);
    assert.equal(await reserve("quote-a"), numbers[0]);
    assert.equal(database.size, 1);
    assert.ok(collisions >= 1);
  } finally {
    global.fetch = priorFetch;
    if (priorToken === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorToken;
  }
});
