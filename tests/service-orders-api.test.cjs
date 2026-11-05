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
    const response = await callApi("PUT", { state: { clients: [], quoteHistory: [], serviceOrders: [{ ...order, number: "99999-2026", employeeName: "Invasor", createdByMemberId: "invasor", createdByName: "Invasor", assignedMemberId: "invasor" }] }, config: {} });
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.payload.state.serviceOrders[0].employeeName, "Ana");
    assert.equal(response.body.payload.state.serviceOrders[0].number, order.number);
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
    const otherRequest = await callApi("POST", { action: "request_counter_sale_deletion", ...anaAccess, saleId: biaSale.body.id, reason: "Lançamento errado" });
    assert.equal(otherRequest.statusCode, 403);
    const invalidReason = await callApi("POST", { action: "request_counter_sale_deletion", ...anaAccess, saleId: anaSale.body.id, reason: "x" });
    assert.equal(invalidReason.statusCode, 400);
    const requested = await callApi("POST", { action: "request_counter_sale_deletion", ...anaAccess, saleId: anaSale.body.id, reason: "Valor lançado por engano" });
    assert.equal(requested.statusCode, 200);
    const duplicateRequest = await callApi("POST", { action: "request_counter_sale_deletion", ...anaAccess, saleId: anaSale.body.id, reason: "Outra razão" });
    assert.equal(duplicateRequest.statusCode, 409);
    const oldDirectDelete = await callApi("POST", { action: "delete_counter_sale", mode: "admin", password: "admin-test-password", saleId: anaSale.body.id });
    assert.equal(oldDirectDelete.statusCode, 400);
    const memberPending = await callApi("POST", { action: "get_sales_dashboard", ...anaAccess, month: "2026-11" });
    assert.equal(memberPending.body.selected.total, 112.5);
    assert.equal(memberPending.body.entries.find((entry) => entry.id === anaSale.body.id).deletionRequest.status, "pending");
    const adminPending = await callApi("POST", { action: "get_sales_dashboard", mode: "admin", password: "admin-test-password", month: "2026-10" });
    assert.equal(adminPending.body.pendingDeletionRequests.length, 1);
    assert.equal(adminPending.body.pendingDeletionRequests[0].requestedByName, "Ana");
    assert.equal(adminPending.body.pendingDeletionRequests[0].reason, "Valor lançado por engano");
    const deniedReview = await callApi("POST", { action: "review_counter_sale_deletion", ...anaAccess, saleId: anaSale.body.id, decision: "delete" });
    assert.equal(deniedReview.statusCode, 401);
    const kept = await callApi("POST", { action: "review_counter_sale_deletion", mode: "admin", password: "admin-test-password", saleId: anaSale.body.id, decision: "keep" });
    assert.equal(kept.statusCode, 200);
    const afterKeep = await callApi("POST", { action: "get_sales_dashboard", ...anaAccess, month: "2026-11" });
    assert.equal(afterKeep.body.selected.total, 112.5);
    assert.equal(afterKeep.body.entries.find((entry) => entry.id === anaSale.body.id).deletionRequest.status, "kept");
    const requestAgain = await callApi("POST", { action: "request_counter_sale_deletion", ...anaAccess, saleId: anaSale.body.id, reason: "Repetir pedido" });
    assert.equal(requestAgain.statusCode, 409);
    const repeatReview = await callApi("POST", { action: "review_counter_sale_deletion", mode: "admin", password: "admin-test-password", saleId: anaSale.body.id, decision: "delete" });
    assert.equal(repeatReview.statusCode, 409);
    const biaRequested = await callApi("POST", { action: "request_counter_sale_deletion", ...biaAccess, saleId: biaSale.body.id, reason: "Venda duplicada" });
    assert.equal(biaRequested.statusCode, 200);
    const deleted = await callApi("POST", { action: "review_counter_sale_deletion", mode: "admin", password: "admin-test-password", saleId: biaSale.body.id, decision: "delete" });
    assert.equal(deleted.statusCode, 200);
    const afterDelete = await callApi("POST", { action: "get_sales_dashboard", ...biaAccess, month: "2026-10" });
    assert.equal(afterDelete.body.selected.total, 0);
    assert.equal(afterDelete.body.reviewedDeletions[0].description, "Papel");
    assert.equal(afterDelete.body.reviewedDeletions[0].amount, 9.99);
    assert.equal(database.get("graficalc-counter-sales").payload.deletedSales.length, 1);
  });
});

test("reserva uma sequência geral entre colaboradores e continua após a maior O.S. existente", async () => {
  const priorToken = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const priorFetch = global.fetch;
  process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_test";
  const database = new Map();
  const year = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(new Date());
  database.set("graficalc-global", {
    state_key: "graficalc-global",
    payload: { state: { serviceOrders: [
      { id: "old-os", quoteId: "old-quote", number: `00007-${year}` },
      { id: "legacy-os", quoteId: "legacy-quote", number: "OS-20261029-10000000" },
    ] } },
    updated_at: "2026-11-05T00:00:00.000Z",
  });
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

  async function reserve(quoteId, memberId) {
    const request = Readable.from([JSON.stringify({ action: "reserve_service_order_number", quoteId, memberId })]);
    request.method = "POST";
    const response = { statusCode: 0, setHeader() {}, end(value) { this.body = JSON.parse(value); } };
    await handler(request, response);
    assert.equal(response.statusCode, 200);
    return response.body.number;
  }

  try {
    const numbers = await Promise.all([reserve("quote-a", "ana"), reserve("quote-b", "bia")]);
    assert.deepEqual(numbers.map((number) => number.slice(0, 5)).sort(), ["00008", "00009"]);
    assert.equal(await reserve("quote-a"), numbers[0]);
    assert.equal(database.size, 2);
    assert.ok(collisions >= 1);
    const forged = await callApi("PUT", { state: { serviceOrders: [{ id: "new-os", quoteId: "quote-a", number: `99999-${year}` }] }, config: {} });
    assert.equal(forged.statusCode, 409);
    const saved = await callApi("PUT", { state: { serviceOrders: [{ id: "new-os", quoteId: "quote-a", number: numbers[0] }] }, config: {} });
    assert.equal(saved.statusCode, 200);
    assert.equal(saved.body.payload.state.serviceOrders.find((order) => order.id === "new-os").number, numbers[0]);
    const savedByOtherMember = await callApi("PUT", { state: { serviceOrders: [{ id: "second-os", quoteId: "quote-b", number: numbers[1], createdByMemberId: "bia" }] }, config: {} });
    assert.equal(savedByOtherMember.statusCode, 200);
    assert.deepEqual(savedByOtherMember.body.payload.state.serviceOrders.filter((order) => order.id === "new-os" || order.id === "second-os").map((order) => order.number).sort(), [...numbers].sort());
  } finally {
    global.fetch = priorFetch;
    if (priorToken === undefined) delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    else process.env.SUPABASE_SERVICE_ROLE_KEY = priorToken;
  }
});

test("contador compartilhado atrasado avança após a maior O.S. sem separar por colaborador", async () => {
  await withMockDatabase(async (database) => {
    const year = new Intl.DateTimeFormat("en-US", { timeZone: "America/Sao_Paulo", year: "numeric" }).format(new Date());
    const key = `graficalc-os-sequence-${year}`;
    database.set("graficalc-global", { state_key: "graficalc-global", payload: { state: { serviceOrders: [{ id: "old", quoteId: "old-q", number: `00007-${year}` }] } }, updated_at: "2026-11-05T00:00:00.000Z" });
    database.set(key, { state_key: key, payload: { lastNumber: 3, quotes: {} }, updated_at: "2026-11-05T00:00:00.000Z" });
    const reserved = await callApi("POST", { action: "reserve_service_order_number", quoteId: "next-q", memberId: "qualquer-colaborador" });
    assert.equal(reserved.statusCode, 200);
    assert.equal(reserved.body.number, `00008-${year}`);
    assert.equal(database.get(key).payload.lastNumber, 8);
  });
});
