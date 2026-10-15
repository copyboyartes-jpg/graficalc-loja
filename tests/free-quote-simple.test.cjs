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

test("orçamento livre multiplica quantidade pelo valor unitário sem alterar a descrição ao cliente", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Identidade visual", description: "Criação de logotipo e manual", quantity: 2, unitValue: 125 };
  const { html, text, workbook } = quote(state);
  assert.equal(workbook.totals.totalGeneral, 250);
  assert.equal(workbook.totals.totalQuantity, 2);
  assert.equal(workbook.activeRows[0].total, 250);
  assert.match(html, /<strong>Identidade visual<\/strong>\s*<small>Criação de logotipo e manual<\/small>/);
  assert.match(text, /- Identidade visual \| Criação de logotipo e manual \| R\$\s+250,00/);
  assert.doesNotMatch(text, /\d+ un\. \|.*por un\.|Criação de arte:| base \|/);
  assert.doesNotMatch(html, /Orçamento livre \|/);
});

test("descrição é opcional, mas nome, quantidade e valor unitário são necessários", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Arte final", unitValue: 80 };
  assert.equal(quote(state).workbook.activeRows.length, 1);
  assert.match(quote(state).text, /- Arte final \| R\$\s+80,00/);
  state.freeQuoteItems[0].itemName = "";
  assert.equal(quote(state).workbook.activeRows.length, 0);
  assert.match(quote(state).workbook.warnings[0], /nome do item/);
  state.freeQuoteItems[0].itemName = "Arte final";
  state.freeQuoteItems[0].quantity = 0;
  assert.equal(quote(state).workbook.activeRows.length, 0);
  assert.match(quote(state).workbook.warnings[0], /quantidade/);
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
  assert.equal(state.freeQuoteItems[0].quantity, 1);
  assert.equal(state.freeQuoteItems[0].unitValue, 65);
  assert.equal(quote(state).workbook.totals.totalGeneral, 65);
  const restored = app.createDefaultState();
  assert.equal(app.applyQuoteHistorySnapshot(restored, { freeQuoteItems: [oldRow] }), true);
  assert.equal(restored.freeQuoteItems[0].unitValue, 65);
});

test("orçamentos com o antigo campo de valor conservam o total", () => {
  const state = app.mergeState({ freeQuoteItems: [{ itemName: "Projeto", description: "Duas propostas", value: 95 }] });
  assert.equal(state.freeQuoteItems[0].quantity, 1);
  assert.equal(state.freeQuoteItems[0].unitValue, 95);
  assert.equal(quote(state).workbook.totals.totalGeneral, 95);
});

test("itens livres novos preservam quantidade e preço ao reabrir o histórico", () => {
  const state = app.createDefaultState();
  state.freeQuoteItems[0] = { ...state.freeQuoteItems[0], itemName: "Projeto", description: "Duas propostas", quantity: 2, unitValue: 47.5 };
  const restored = app.createDefaultState();
  assert.equal(app.applyQuoteHistorySnapshot(restored, app.createQuoteHistorySnapshot(state)), true);
  assert.equal(restored.freeQuoteItems[0].itemName, "Projeto");
  assert.equal(restored.freeQuoteItems[0].description, "Duas propostas");
  assert.equal(restored.freeQuoteItems[0].quantity, 2);
  assert.equal(restored.freeQuoteItems[0].unitValue, 47.5);
  assert.equal(quote(restored).workbook.totals.totalGeneral, 95);
  const items = app.collectQuoteUrgencyItems(Array.from({ length: 12 }, (_, index) => index === 4
    ? app.calculateFreeQuoteWorkbook(restored)
    : { activeRows: [] }));
  assert.equal(items[0].description, "Projeto");
});

test("produto livre salvo pode ser selecionado com outra quantidade em Produtos prontos", () => {
  const config = app.createDefaultConfig();
  const saved = app.saveFreeQuoteProduct(config, {
    itemName: "Adesivo especial",
    description: "Corte personalizado",
    unitValue: 12.5,
  });
  assert.equal(saved.updated, false);
  assert.equal(config.customReadyProducts.length, 1);
  const restoredConfig = app.mergeConfig(JSON.parse(JSON.stringify(config)));
  assert.match(app.buildReadyProductOptions(saved.product.id, restoredConfig), /Adesivo especial/);
  const state = app.createDefaultState();
  state.readyProductItems[0].productType = saved.product.id;
  state.readyProductItems[0].quantity = 4;
  const workbook = app.calculateReadyProductWorkbook(state, restoredConfig);
  assert.equal(workbook.activeRows[0].productType, saved.product.id);
  assert.equal(workbook.activeRows[0].unitPrice, 12.5);
  assert.equal(workbook.activeRows[0].description, "Corte personalizado");
  assert.equal(workbook.totals.totalGeneral, 50);

  const updated = app.saveFreeQuoteProduct(restoredConfig, {
    itemName: "adesivo especial",
    description: "Corte atualizado",
    unitValue: 15,
  });
  assert.equal(updated.updated, true);
  assert.equal(restoredConfig.customReadyProducts.length, 1);
  assert.equal(restoredConfig.customReadyProducts[0].id, saved.product.id);
  assert.equal(app.calculateReadyProductWorkbook(state, restoredConfig).totals.totalGeneral, 60);
});
