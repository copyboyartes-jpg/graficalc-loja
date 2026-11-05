const assert = require("node:assert/strict");
const { Readable } = require("node:stream");
const test = require("node:test");
const handler = require("../api/shared-state.js");

async function callApi(method, body, url = "/api/shared-state") {
  const request = Readable.from(body === undefined ? [] : [JSON.stringify(body)]);
  request.method = method;
  request.url = url;
  const response = { statusCode: 0, setHeader() {}, end(value) { this.body = value ? JSON.parse(value) : null; } };
  await handler(request, response);
  return response;
}

async function withMockDatabase(run) {
  const priorToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priorAdmin = process.env.CONFIG_ACCESS_PASSWORD;
  const priorFetch = global.fetch;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_test";
  process.env.CONFIG_ACCESS_PASSWORD = "admin-test-password";
  const database = new Map();
  global.fetch = async (url, options) => {
    const requestUrl = new URL(url);
    const key = requestUrl.searchParams.get("state_key")?.replace(/^eq\./, "");
    const response = (data) => ({ ok: true, status: 200, json: async () => structuredClone(data) });
    if (options.method === "GET") return response(database.has(key) ? [database.get(key)] : []);
    if (options.method === "POST") {
      const entry = JSON.parse(options.body);
      if (!database.has(entry.state_key)) database.set(entry.state_key, entry);
      return response(database.get(entry.state_key)?.updated_at === entry.updated_at ? [database.get(entry.state_key)] : []);
    }
    if (options.method === "PATCH") {
      const entry = database.get(key);
      const expected = requestUrl.searchParams.get("updated_at")?.replace(/^eq\./, "");
      if (!entry || entry.updated_at !== expected) return response([]);
      Object.assign(entry, JSON.parse(options.body));
      return response([entry]);
    }
    throw new Error(`Unexpected method: ${options.method}`);
  };
  try {
    await run(database);
  } finally {
    global.fetch = priorFetch;
    if (priorToken === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorToken;
    if (priorAdmin === undefined) delete process.env.CONFIG_ACCESS_PASSWORD;
    else process.env.CONFIG_ACCESS_PASSWORD = priorAdmin;
  }
}

test("cliente antigo não apaga O.S. ao salvar o estado compartilhado", async () => {
  await withMockDatabase(async (database) => {
    const order = { id: "os-1", quoteId: "q-1", number: "00001-2026", employeeName: "Ana", createdByMemberId: "member-1", createdByName: "Ana", assignedMemberId: "member-1" };
    database.set("graficalc-global", { state_key: "graficalc-global", payload: { state: { serviceOrders: [order] } }, updated_at: "2026-10-29T00:00:00.000Z" });
    const response = await callApi("PUT", { state: { clients: [], quoteHistory: [], serviceOrders: [{ ...order, employeeName: "Invasor", createdByMemberId: "invasor", createdByName: "Invasor", assignedMemberId: "invasor" }] }, config: {} });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.payload.state.serviceOrders[0].employeeName, "Ana");
    assert.equal(response.body.payload.state.serviceOrders[0].createdByMemberId, "member-1");
    assert.equal(database.get("graficalc-global").payload.state.serviceOrders[0].assignedMemberId, "member-1");
    const stale = await callApi("PUT", { state: { clients: [], quoteHistory: [] }, config: {} });
    assert.equal(stale.statusCode, 200);
    assert.equal(stale.body.payload.state.serviceOrders[0].number, order.number);
  });
});

test("equipe guarda senhas fora da resposta pública e exige a senha das configurações para cadastro", async () => {
  await withMockDatabase(async (database) => {
    const denied = await callApi("POST", { action: "save_team_member", name: "Ana", password: "senha-ana-123", adminPassword: "errada" });
    assert.equal(denied.statusCode, 401);
    assert.equal(database.size, 0);
    const registered = await callApi("POST", { action: "save_team_member", name: "Ana", password: "senha-ana-123", adminPassword: "admin-test-password" });
    assert.equal(registered.statusCode, 200);
    assert.equal(registered.body.members[0].name, "Ana");
    assert.equal(registered.body.members[0].passwordHash, undefined);
    const stored = database.get("graficalc-team").payload.members[0];
    assert.notEqual(stored.passwordHash, "senha-ana-123");
    assert.equal(stored.passwordHash.length, 64);
    const publicList = await callApi("GET", undefined, "/api/shared-state?resource=team");
    assert.equal(publicList.statusCode, 200);
    assert.deepEqual(publicList.body.members, registered.body.members);
    assert.doesNotMatch(JSON.stringify(publicList.body), /passwordHash|salt|senha-ana-123/);
    const duplicate = await callApi("POST", { action: "save_team_member", name: "ana", password: "outra-senha", adminPassword: "admin-test-password" });
    assert.equal(duplicate.statusCode, 409);
  });
});

test("alterar responsável da O.S. exige senha do criador original, inclusive após uma troca", async () => {
  await withMockDatabase(async (database) => {
    const register = async (name, password) => {
      const response = await callApi("POST", { action: "save_team_member", name, password, adminPassword: "admin-test-password" });
      assert.equal(response.statusCode, 200);
      return response.body.members.find((member) => member.name === name).id;
    };
    const anaId = await register("Ana", "senha-ana-123");
    const biaId = await register("Bia", "senha-bia-456");
    const order = { id: "os-2", quoteId: "q-2", number: "00002-2026", employeeName: "Ana", createdByMemberId: anaId, createdByName: "Ana", assignedMemberId: anaId };
    database.set("graficalc-global", { state_key: "graficalc-global", payload: { state: { serviceOrders: [order] }, config: {} }, updated_at: "2026-11-04T00:00:00.000Z" });
    const wrong = await callApi("POST", { action: "change_os_employee", orderId: order.id, memberId: biaId, creatorPassword: "senha-bia-456" });
    assert.equal(wrong.statusCode, 401);
    assert.equal(database.get("graficalc-global").payload.state.serviceOrders[0].employeeName, "Ana");
    const changed = await callApi("POST", { action: "change_os_employee", orderId: order.id, memberId: biaId, creatorPassword: "senha-ana-123" });
    assert.equal(changed.statusCode, 200);
    assert.equal(changed.body.order.employeeName, "Bia");
    assert.equal(changed.body.order.createdByMemberId, anaId);
    assert.equal(changed.body.order.createdByName, "Ana");
    const secondWrong = await callApi("POST", { action: "change_os_employee", orderId: order.id, memberId: anaId, creatorPassword: "senha-bia-456" });
    assert.equal(secondWrong.statusCode, 401);
    const secondRight = await callApi("POST", { action: "change_os_employee", orderId: order.id, memberId: anaId, creatorPassword: "senha-ana-123" });
    assert.equal(secondRight.statusCode, 200);
    assert.equal(secondRight.body.order.employeeName, "Ana");
    assert.equal(secondRight.body.order.createdByMemberId, anaId);
  });
});

test("O.S. antiga usa a senha do primeiro nome cadastrado para trocar responsável", async () => {
  await withMockDatabase(async (database) => {
    const registered = await callApi("POST", { action: "save_team_member", name: "Ana", password: "senha-ana-123", adminPassword: "admin-test-password" });
    const anaId = registered.body.members[0].id;
    const added = await callApi("POST", { action: "save_team_member", name: "Bia", password: "senha-bia-456", adminPassword: "admin-test-password" });
    const biaId = added.body.members.find((member) => member.name === "Bia").id;
    const legacy = { id: "os-old", quoteId: "q-old", employeeName: "Ana" };
    database.set("graficalc-global", { state_key: "graficalc-global", payload: { state: { serviceOrders: [legacy] }, config: {} }, updated_at: "2026-11-04T00:00:00.000Z" });
    const changed = await callApi("POST", { action: "change_os_employee", orderId: legacy.id, memberId: biaId, creatorPassword: "senha-ana-123" });
    assert.equal(changed.statusCode, 200);
    assert.equal(changed.body.order.createdByMemberId, anaId);
    assert.equal(changed.body.order.createdByName, "Ana");
    assert.equal(changed.body.order.employeeName, "Bia");
  });
});

test("métricas mensais exigem senha e separam vendas da O.S., balcão e orçamentos sem colaborador", async () => {
  await withMockDatabase(async (database) => {
    const register = async (name, password) => {
      const response = await callApi("POST", { action: "save_team_member", name, password, adminPassword: "admin-test-password" });
      assert.equal(response.statusCode, 200);
      return response.body.members.find((member) => member.name === name).id;
    };
    const anaId = await register("Ana", "senha-ana-123");
    const biaId = await register("Bia", "senha-bia-456");
    const quotes = [
      { id: "q1", title: "Adesivos", clientName: "Cliente A", status: "Aprovado", total: 100, approvedAt: "2026-11-04T14:00:00Z" },
      { id: "q2", title: "Lona", status: "Aprovado", total: 50, approvedAt: "2026-11-04T14:00:00Z" },
      { id: "q3", title: "Pendente", status: "Pendente", total: 300, createdAt: "2026-11-04T14:00:00Z" },
      { id: "q4", title: "Virada de mês", status: "Aprovado", total: 30, approvedAt: "2026-11-01T01:00:00Z" },
      { id: "q5", title: "O.S. antiga", status: "Aprovado", total: 40, approvedAt: "2026-11-03T14:00:00Z" },
    ];
    const orders = [
      { id: "os1", quoteId: "q1", createdByMemberId: anaId, createdByName: "Ana", assignedMemberId: biaId, employeeName: "Bia", number: "00001-2026" },
      { id: "os-old", quoteId: "q5", employeeName: "Bia", number: "OS-ANTIGA" },
      { id: "os-duplicate", quoteId: "q1", employeeName: "Bia", number: "DUPLICADA" },
    ];
    database.set("graficalc-global", { state_key: "graficalc-global", payload: { state: { quoteHistory: quotes, serviceOrders: orders } }, updated_at: "2026-11-04T00:00:00Z" });
    const anaAccess = { mode: "member", memberId: anaId, password: "senha-ana-123" };
    const biaAccess = { mode: "member", memberId: biaId, password: "senha-bia-456" };
    const denied = await callApi("POST", { action: "get_sales_dashboard", mode: "member", memberId: anaId, password: "errada", month: "2026-11" });
    assert.equal(denied.statusCode, 401);
    const badDate = await callApi("POST", { action: "add_counter_sale", ...anaAccess, date: "2026-02-30", description: "Teste", amount: 10 });
    assert.equal(badDate.statusCode, 400);
    const anaSale = await callApi("POST", { action: "add_counter_sale", ...anaAccess, date: "2026-11-05", description: "Cópias de balcão", customerName: "Cliente B", amount: "12.50" });
    assert.equal(anaSale.statusCode, 200);
    const biaSale = await callApi("POST", { action: "add_counter_sale", ...biaAccess, date: "2026-10-31", description: "Papel", amount: 9.99 });
    assert.equal(biaSale.statusCode, 200);
    const ana = await callApi("POST", { action: "get_sales_dashboard", ...anaAccess, month: "2026-11" });
    assert.equal(ana.statusCode, 200);
    assert.equal(ana.body.selected.systemTotal, 100);
    assert.equal(ana.body.selected.counterTotal, 12.5);
    assert.equal(ana.body.selected.total, 112.5);
    assert.equal(ana.body.entries.length, 2);
    assert.equal(ana.body.team, undefined);
    assert.ok(ana.body.entries.some((entry) => entry.orderNumber === "00001-2026"));
    const adminDenied = await callApi("POST", { action: "get_sales_dashboard", mode: "admin", password: "errada", month: "2026-11" });
    assert.equal(adminDenied.statusCode, 401);
    const admin = await callApi("POST", { action: "get_sales_dashboard", mode: "admin", password: "admin-test-password", month: "2026-11" });
    assert.equal(admin.statusCode, 200);
    assert.equal(admin.body.selected.total, 202.5);
    assert.equal(admin.body.team.find((member) => member.id === anaId).total, 112.5);
    assert.equal(admin.body.team.find((member) => member.id === biaId).total, 40);
    assert.equal(admin.body.team.find((member) => member.name === "Sem colaborador").total, 50);
    const october = await callApi("POST", { action: "get_sales_dashboard", mode: "admin", password: "admin-test-password", month: "2026-10" });
    assert.equal(october.body.selected.total, 39.99);
    const memberDelete = await callApi("POST", { action: "delete_counter_sale", ...anaAccess, saleId: biaSale.body.id });
    assert.equal(memberDelete.statusCode, 401);
    const adminDelete = await callApi("POST", { action: "delete_counter_sale", mode: "admin", password: "admin-test-password", saleId: anaSale.body.id });
    assert.equal(adminDelete.statusCode, 200);
    const after = await callApi("POST", { action: "get_sales_dashboard", ...anaAccess, month: "2026-11" });
    assert.equal(after.body.selected.total, 100);
  });
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
