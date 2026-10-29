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
