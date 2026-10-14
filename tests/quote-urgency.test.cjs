const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = {
  window: { BLOCK_CATALOG: [] },
  document: { getElementById: () => ({ innerHTML: "" }) },
  Intl,
  URL,
  console,
};
vm.createContext(app);
vm.runInContext(source, app);

function workbooks() {
  const books = Array.from({ length: 12 }, () => ({ activeRows: [], totals: { totalGeneral: 0, totalQuantity: 0 } }));
  books[1] = { activeRows: [{ id: "color-1", description: "Cartaz", total: 100, quantity: 1, paperType: "Couchê", printMode: "Só frente", size: "A4" }], totals: { totalGeneral: 100, totalQuantity: 1 } };
  books[4] = { activeRows: [{ id: "free-1", description: "Arte", total: 50, quantity: 1, unitValue: 50, baseTotal: 50, artCreationFee: 0 }], totals: { totalGeneral: 50, totalQuantity: 1 } };
  return books;
}

test("duas urgências são alternativas sobre o total após desconto", () => {
  const state = app.createDefaultState();
  state.productionDeadline = "3 dias úteis";
  state.quoteDiscountType = "R$";
  state.quoteDiscountValue = 30;
  state.quoteUrgency.tomorrow = { type: "%", value: 10 };
  state.quoteUrgency.today = { type: "R$", value: 25 };
  const books = workbooks();
  const discount = app.calculateDiscount(150, state.quoteDiscountType, state.quoteDiscountValue);
  const fees = app.calculateQuoteUrgency(state, app.collectQuoteUrgencyItems(books), discount);
  assert.equal(fees.tomorrow.amount, 12);
  assert.equal(fees.tomorrow.total, 132);
  assert.equal(fees.today.amount, 25);
  assert.equal(fees.today.total, 145);
  const html = app.createQuoteHtml(state, ...books);
  const text = app.createQuoteText(state, ...books);
  assert.match(html, /Valor padrão/);
  assert.match(html, /Prazo: 3 dias úteis/);
  assert.match(html, /Produzir para amanhã/);
  assert.match(html, /Produzir para hoje/);
  assert.match(text, /Valor padrão \(3 dias úteis\): R\$\s+120,00/);
  assert.match(text, /Produzir para amanhã: taxa 10% \(R\$\s+12,00\) \| total R\$\s+132,00/);
  assert.match(text, /Produzir para hoje: taxa R\$\s+25,00 \(R\$\s+25,00\) \| total R\$\s+145,00/);
});

test("taxa percentual só incide nos itens escolhidos, com desconto proporcional", () => {
  const state = app.createDefaultState();
  state.quoteUrgency.scope = "selected";
  state.quoteUrgency.selectedItemKeys = ["color:color-1"];
  state.quoteUrgency.tomorrow = { type: "%", value: 10 };
  state.quoteUrgency.today = { type: "R$", value: 20 };
  const books = workbooks();
  const discount = app.calculateDiscount(150, "R$", 30);
  const fees = app.calculateQuoteUrgency(state, app.collectQuoteUrgencyItems(books), discount);
  assert.equal(fees.tomorrow.amount, 8);
  assert.equal(fees.today.amount, 20);
  assert.equal(fees.tomorrow.total, 128);
  assert.equal(fees.today.total, 140);
  assert.match(app.createQuoteText(state, ...books), /Itens com urgência: Cartaz/);
  state.quoteUrgency.selectedItemKeys = [];
  const withoutSelection = app.calculateQuoteUrgency(state, app.collectQuoteUrgencyItems(books), discount);
  assert.equal(withoutSelection.tomorrow.active, false);
  assert.equal(withoutSelection.today.active, false);
});

test("configuração de urgência volta pelo histórico e não vaza quando total está oculto", () => {
  const state = app.createDefaultState();
  state.quoteUrgency.scope = "selected";
  state.quoteUrgency.selectedItemKeys = ["color:color-1"];
  state.quoteUrgency.today = { type: "%", value: 15 };
  const snapshot = app.createQuoteHistorySnapshot(state);
  const restored = app.createDefaultState();
  assert.equal(app.applyQuoteHistorySnapshot(restored, snapshot), true);
  assert.equal(restored.quoteUrgency.scope, "selected");
  assert.deepEqual([...restored.quoteUrgency.selectedItemKeys], ["color:color-1"]);
  assert.equal(restored.quoteUrgency.today.value, 15);
  restored.quoteTotalVisibility = "hide";
  assert.doesNotMatch(app.createQuoteHtml(restored, ...workbooks()), /Opções de urgência/);
  assert.doesNotMatch(app.createQuoteText(restored, ...workbooks()), /Produzir para hoje/);
});
