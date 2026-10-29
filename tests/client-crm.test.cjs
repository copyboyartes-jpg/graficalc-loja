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
