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

function quote(state) {
  const workbooks = Array.from({ length: 12 }, () => ({ activeRows: [], totals: { totalGeneral: 0, totalQuantity: 0 } }));
  workbooks[4] = app.calculateFreeQuoteWorkbook(state);
  return {
    html: app.createQuoteHtml(state, ...workbooks),
    text: app.createQuoteText(state, ...workbooks),
    workbook: workbooks[4],
  };
}

test("orçamento livre mostra apenas nome, descrição e valor ao cliente", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Identidade visual", description: "Criação de logotipo e manual", value: 250 };
  const { html, text, workbook } = quote(state);
  assert.equal(workbook.totals.totalGeneral, 250);
  assert.match(html, /<strong>Identidade visual<\/strong>\s*<small>Criação de logotipo e manual<\/small>/);
  assert.match(text, /- Identidade visual \| Criação de logotipo e manual \| R\$\s+250,00/);
  assert.doesNotMatch(text, /\d+ un\. \|.*por un\.|Criação de arte:| base \|/);
  assert.doesNotMatch(html, /Orçamento livre \|/);
});

test("descrição é opcional, mas nome e valor são necessários", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Arte final", value: 80 };
  assert.equal(quote(state).workbook.activeRows.length, 1);
  assert.match(quote(state).text, /- Arte final \| R\$\s+80,00/);
  state.freeQuoteItems[0].itemName = "";
  assert.equal(quote(state).workbook.activeRows.length, 0);
  assert.match(quote(state).workbook.warnings[0], /nome do item/);
});

test("linha antiga conserva o preço final após quantidade, arte e desconto", () => {
  const oldRow = {
    id: "free-quote-row-1",
    description: "Pintura especial",
    quantity: 3,
    unitValue: 20,
    artCreationFee: 10,
    discountType: "R$",
    discountValue: 5,
  };
  const state = app.mergeState({ freeQuoteItems: [oldRow] });
  assert.equal(state.freeQuoteItems[0].itemName, "Pintura especial");
  assert.equal(state.freeQuoteItems[0].description, "");
  assert.equal(state.freeQuoteItems[0].value, 65);
  assert.equal(quote(state).workbook.totals.totalGeneral, 65);
  const restored = app.createDefaultState();
  assert.equal(app.applyQuoteHistorySnapshot(restored, { freeQuoteItems: [oldRow] }), true);
  assert.equal(restored.freeQuoteItems[0].value, 65);
});

test("itens livres novos preservam descrição e valor ao reabrir o histórico", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Projeto", description: "Duas propostas", value: 95 };
  const restored = app.createDefaultState();
  assert.equal(app.applyQuoteHistorySnapshot(restored, app.createQuoteHistorySnapshot(state)), true);
  assert.equal(restored.freeQuoteItems[0].itemName, "Projeto");
  assert.equal(restored.freeQuoteItems[0].description, "Duas propostas");
  assert.equal(restored.freeQuoteItems[0].value, 95);
  const items = app.collectQuoteUrgencyItems(Array.from({ length: 12 }, (_, index) => index === 4
    ? app.calculateFreeQuoteWorkbook(restored)
    : { activeRows: [] }));
  assert.equal(items[0].description, "Projeto");
});
