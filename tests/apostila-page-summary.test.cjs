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

test("conta páginas por impressão, tamanho e grupo sem misturar tipos", () => {
  const rows = [
    { printType: "Colorido jato de tinta", size: "A4", pages: 152, quantity: 1, bindingGroup: "A" },
    { printType: "Preto e branco", size: "A4", pages: 325, quantity: 1, bindingGroup: "A" },
    { printType: "Colorido laser", size: "A3", pages: 4, colorPages: 1, quantity: 2, bindingGroup: "B" },
  ].map((row, index) => ({ ...app.createDefaultRow(index), ...row }));
  const result = app.summarizeApostilaPages(rows);

  assert.equal(result.totalPages, 485);
  assert.equal(result.byType.find((item) => item.printType === "Colorido jato de tinta").pages, 152);
  assert.equal(result.byType.find((item) => item.printType === "Preto e branco").pages, 331);
  assert.equal(result.byType.find((item) => item.printType === "Colorido laser").pages, 2);
  assert.equal(result.bySizeAndType.find((item) => item.size === "A3" && item.printType === "Preto e branco").pages, 6);
  assert.equal(result.byGroup.find((group) => group.name === "A").pages, 477);
  assert.equal(result.byGroup.find((group) => group.name === "B").pages, 8);
  const markup = app.createApostilaPageSummaryMarkup(result, "Somar quantidades");
  assert.match(markup, /152 páginas/);
  assert.match(markup, /A3 · Preto e branco/);
});

test("configura somente os arquivos do grupo selecionado", () => {
  const rows = [
    { ...app.createDefaultRow(0), bindingGroup: "A", pages: 12, quantity: 2 },
    { ...app.createDefaultRow(1), bindingGroup: "A", pages: 8, quantity: 3 },
    { ...app.createDefaultRow(2), bindingGroup: "B", pages: 5, quantity: 1 },
  ];
  const preset = { ...app.createDefaultState().presets, printType: "Colorido laser", size: "A3", innerPaper: "Couche 170g", pagesPerSheet: 2 };
  assert.equal(app.applyPresetToGroup(rows, preset, "A"), 2);
  assert.equal(rows[0].printType, "Colorido laser");
  assert.equal(rows[1].size, "A3");
  assert.equal(rows[1].pagesPerSheet, 2);
  assert.equal(rows[0].pages, 12);
  assert.equal(rows[1].quantity, 3);
  assert.equal(rows[2].printType, "Preto e branco");
  assert.equal(app.applyPresetToGroup(rows, preset, ""), 0);
});

test("Somar quantidades usa a faixa apenas do mesmo tamanho e tipo", () => {
  const state = app.createDefaultState();
  state.calcMode = "Somar quantidades";
  state.rows = [
    { printType: "Colorido jato de tinta", size: "A4", pages: 1, quantity: 1 },
    { printType: "Colorido jato de tinta", size: "A4", pages: 1, quantity: 2 },
    { printType: "Colorido jato de tinta", size: "A5", pages: 1, quantity: 1 },
    { printType: "Preto e branco", size: "A4", pages: 1, quantity: 1 },
  ].map((row, index) => ({ ...app.createDefaultRow(index), ...row }));
  const config = app.createDefaultConfig();
  config.printPricing.inkjet = [{ min: 1, value: 10 }, { min: 3, value: 5 }];
  const rows = app.calculateWorkbook(state, config).rows;
  assert.equal(rows[0].innerTotal, 5);
  assert.equal(rows[1].innerTotal, 10);
  assert.equal(rows[2].innerTotal, 10);
  assert.notEqual(rows[3].innerTotal, 5);
});
