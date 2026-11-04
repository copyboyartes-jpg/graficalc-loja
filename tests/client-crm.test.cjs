const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = { window: { BLOCK_CATALOG: [] }, document: { getElementById: () => ({ innerHTML: "" }) }, Intl, URL, console };
vm.createContext(app);
vm.runInContext(source, app);

const clients = [
  { id: "client-1", name: "Gráfica São José", contact: "", cnpj: "12.345.678/0001-90" },
  { id: "client-2", name: "Outro cliente", contact: "", cnpj: "" },
];

test("orçamentos antigos são associados ao cliente por nome ou CNPJ únicos", () => {
  const oldQuote = { id: "old", clientName: "Grafica Sao Jose", snapshot: { client: { cnpj: "" } } };
  assert.equal(app.getQuoteClient(oldQuote, clients)?.id, "client-1");
  assert.equal(app.getQuoteClient({ clientName: "", snapshot: { client: { cnpj: "12345678000190" } } }, clients)?.id, "client-1");
  assert.equal(app.getQuoteClient({ clientId: "client-2", clientName: "Gráfica São José" }, clients)?.id, "client-2");
  assert.equal(app.getQuoteClient(oldQuote, [...clients, { id: "duplicate", name: "Grafica Sao Jose", cnpj: "" }]), null);
});

test("compras e total por cliente usam apenas orçamentos aprovados", () => {
  const quotes = [
    { id: "q1", clientId: "client-1", clientName: "Gráfica São José", status: "Aprovado", total: 150, createdAt: "2026-10-01", items: [{ description: "Adesivo", detail: "10 unidades", total: 150 }] },
    { id: "q2", clientId: "client-1", status: "Pendente", total: 200, items: [{ description: "Lona", detail: "2 m²", total: 200 }] },
    { id: "q3", clientId: "client-2", status: "Aprovado", total: 300, items: [{ description: "Panfleto", total: 300 }] },
  ];
  const stats = app.getClientQuoteStats(clients[0], quotes, clients);
  assert.equal(stats.quoteCount, 2);
  assert.equal(stats.approvedCount, 1);
  assert.equal(stats.spent, 150);
  assert.deepEqual(stats.purchases.map((item) => item.description), ["Adesivo"]);
});

test("histórico separa compras por orçamento, mostra valor e O.S. e soma centavos sem arredondamento indevido", () => {
  const quotes = [
    { id: "q1", clientId: "client-1", title: "Primeira compra", status: "Aprovado", total: 0.1, approvedAt: "2026-10-01T10:00:00Z", items: [{ description: "Adesivo", detail: "10 unidades" }] },
    { id: "q2", clientId: "client-1", title: "Segunda compra", status: "Aprovado", total: 0.2, approvedAt: "2026-11-01T10:00:00Z", items: [{ description: "Lona", detail: "1 m²" }] },
    { id: "q3", clientId: "client-1", title: "Pendente", status: "Pendente", total: 100, createdAt: "2026-11-02T10:00:00Z", items: [{ description: "Panfleto" }] },
    { id: "q4", clientId: "client-2", status: "Aprovado", total: 500, items: [{ description: "Outro cliente" }] },
  ];
  const orders = [{ quoteId: "q2", number: "00002-2026", status: "Em produção" }];
  const stats = app.getClientQuoteStats(clients[0], quotes, clients, orders);
  assert.equal(stats.quoteCount, 3);
  assert.equal(stats.approvedCount, 2);
  assert.equal(stats.spent, 0.3);
  assert.deepEqual(stats.purchaseRecords.map((record) => record.quoteId), ["q2", "q1"]);
  const markup = app.createClientPurchaseHistoryMarkup(stats.purchaseRecords);
  assert.match(markup, /Segunda compra/);
  assert.match(markup, /Lona/);
  assert.match(markup, /R\$\s*0,20/);
  assert.match(markup, /O\.S\. nº 00002-2026 · Em produção/);
  assert.match(markup, /Primeira compra/);
  assert.doesNotMatch(markup, /Panfleto|Outro cliente/);
});

test("novo histórico não duplica a logo e restauração mantém a logo atual", () => {
  const state = app.createDefaultState();
  state.company.logoDataUrl = "data:image/png;base64,LOGO";
  state.client.id = "client-1";
  state.client.name = "Gráfica São José";
  const snapshot = app.createQuoteHistorySnapshot(state);
  assert.equal(snapshot.company.logoDataUrl, "");
  const restored = app.createDefaultState();
  restored.company.logoDataUrl = "data:image/png;base64,ATUAL";
  assert.equal(app.applyQuoteHistorySnapshot(restored, snapshot), true);
  assert.equal(restored.company.logoDataUrl, "data:image/png;base64,ATUAL");
  assert.equal(restored.client.id, "client-1");
});
