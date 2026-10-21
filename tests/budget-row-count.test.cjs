const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = { window: { BLOCK_CATALOG: [] }, Intl, URL, console };
vm.createContext(app);
vm.runInContext(source, app);

const rowKeys = [
  "rows", "colorPrintItems", "credentialItems", "readyProductItems", "freeQuoteItems",
  "businessCardItems", "flyerItems", "linearMeterItems", "m2Items", "resinItems",
];

function allRowLists(state) {
  return [...rowKeys.map((key) => state[key]), state.blockItems.sulfite, state.blockItems.autocopiativo];
}

test("todas as abas começam e reiniciam com dois cartões", () => {
  const state = app.createDefaultState();
  assert.ok(allRowLists(state).every((rows) => rows.length === 2));
  state.rows.push({ ...state.rows[0], id: "row-3" });
  state.freeQuoteItems.push({ ...state.freeQuoteItems[0], id: "free-quote-row-3" });
  app.resetBudgetRowsToDefaults(state);
  assert.ok(allRowLists(state).every((rows) => rows.length === 2));
});

test("cinco linhas antigas inteiramente padrão são reduzidas a duas", () => {
  const oldState = app.createDefaultState();
  oldState.budgetRowsVersion = 2;
  for (const rows of allRowLists(oldState)) {
    for (let index = 2; index < 5; index += 1) {
      rows.push({ ...rows[0], id: `legacy-row-${index + 1}` });
    }
  }
  const restored = app.mergeState(oldState);
  assert.ok(allRowLists(restored).every((rows) => rows.length === 2));
  assert.equal(restored.budgetRowsVersion, 3);
});

test("campos obsoletos não mantêm cartões antigos vazios", () => {
  const oldState = app.createDefaultState();
  delete oldState.budgetRowsVersion;
  for (let index = 2; index < 5; index += 1) {
    oldState.credentialItems.push({ ...oldState.credentialItems[0], id: `credential-row-${index + 1}`, oldField: "valor antigo" });
  }
  assert.equal(app.mergeState(oldState).credentialItems.length, 2);
});

test("migração preserva um cartão parcialmente configurado e os itens anteriores", () => {
  const oldState = app.createDefaultState();
  delete oldState.budgetRowsVersion;
  oldState.colorPrintItems.push({ ...oldState.colorPrintItems[0], id: "color-row-3" });
  oldState.colorPrintItems.push({ ...oldState.colorPrintItems[0], id: "color-row-4", paperType: "Couche 170g" });
  oldState.colorPrintItems.push({ ...oldState.colorPrintItems[0], id: "color-row-5" });
  oldState.rows.push({ ...oldState.rows[0], id: "row-3", quantity: 50, pages: 2 });
  oldState.rows.push({ ...oldState.rows[0], id: "row-4" });

  const restored = app.mergeState(oldState);
  assert.equal(restored.colorPrintItems.length, 4);
  assert.equal(restored.colorPrintItems[3].paperType, "Couche 170g");
  assert.equal(restored.rows.length, 3);
  assert.equal(restored.rows[2].quantity, 50);
});

test("cartão vazio adicionado após a migração permanece ao reabrir", () => {
  const state = app.createDefaultState();
  state.rows.push({ ...state.rows[0], id: "row-3" });
  const restored = app.mergeState(state);
  assert.equal(restored.rows.length, 3);
  assert.equal(restored.budgetRowsVersion, 3);
});

test("orçamento livre antigo com uma linha recebe a segunda sem alterar a primeira", () => {
  const restored = app.mergeState({ freeQuoteItems: [{ itemName: "Arte", quantity: 1, unitValue: 80, totalValue: 80, priceMode: "unit" }] });
  assert.equal(restored.freeQuoteItems.length, 2);
  assert.equal(restored.freeQuoteItems[0].itemName, "Arte");
  assert.equal(restored.freeQuoteItems[1].itemName, "");
});

test("os doze botões Adicionar linha ficam depois do último cartão da aba", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const tableFooters = html.match(/<tbody id="[^"]*rows-table-body"><\/tbody>\s*<\/table>\s*<\/div>\s*<div class="add-row-footer"><button id="add-[^"]+-button"/g) || [];
  assert.equal(tableFooters.length, 11);
  assert.match(html, /<div class="free-quote-items" id="free-quote-rows-table-body"><\/div>\s*<div class="add-row-footer"><button id="add-free-quote-row-button"/);
  assert.equal((html.match(/class="add-row-footer"/g) || []).length, 12);
});
