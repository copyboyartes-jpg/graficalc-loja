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

function quote(fields, config = app.createDefaultConfig(), calcMode = "Independente") {
  const state = app.createDefaultState();
  state.calcMode = calcMode;
  state.rows = [fields].flat().map((item, index) => ({
    ...app.createDefaultRow(index),
    printType: "Colorido laser",
    pages: 1,
    quantity: 1,
    ...item,
  }));
  return app.calculateWorkbook(state, config);
}

test("miolo laser aceita todos os papéis de Impressos coloridos", () => {
  const paperKeys = {
    "Sulfite 75g": "Sulfite 75g",
    "Offset 120g": "Offset 120g",
    "Couche 170g": "170g",
    "Offset 170g": "170g",
    "Reciclato 170g": "170g",
    "Couche 250g": "250g",
    "Offset 240g": "250g",
    "Reciclato 240g": "250g",
    "Couche 300g": "300g",
    "Metalizado branco": "300g",
    "Metalizado amarelo": "300g",
  };
  const config = app.createDefaultConfig();
  for (const [paper, key] of Object.entries(paperKeys)) {
    assert.ok(app.getValidApostilaInnerPaper(paper) === paper);
    assert.equal(app.getColorPaperPricingKey(paper), key);
    config.colorPrintPricing[key] = [{ min: 1, value: 17 }];
    config.colorPrintPricingA3[key] = [{ min: 1, value: 23 }];
    assert.equal(quote({ innerPaper: paper, size: "A3" }, config).rows[0].innerTotal, 23);
    if (paper !== "Sulfite 75g") {
      assert.equal(quote({ innerPaper: paper }, config).rows[0].innerTotal, 17);
    }
  }
});

test("Sulfite A4 conserva a tabela laser atual da apostila", () => {
  const config = app.createDefaultConfig();
  config.printPricing.laser = [{ min: 1, value: 6 }];
  config.colorPrintPricing["Sulfite 75g"] = [{ min: 1, value: 99 }];
  assert.equal(quote({ innerPaper: "Sulfite 75g" }, config).rows[0].innerTotal, 6);
});

test("páginas coloridas mistas no laser usam o papel escolhido", () => {
  const config = app.createDefaultConfig();
  config.colorPrintPricing["Offset 120g"] = [{ min: 1, value: 20 }];
  const row = quote({ innerPaper: "Offset 120g", pages: 2, colorPages: 1 }, config).rows[0];
  assert.equal(row.blackWhiteImpressions, 1);
  assert.equal(row.colorImpressions, 1);
  assert.equal(row.innerTotal, 22);
  assert.match(app.buildApostilaPrintDetail(row), /Miolo: Offset 120g/);
});

test("Somar quantidades separa papéis diferentes, mesmo quando compartilham uma tabela", () => {
  const config = app.createDefaultConfig();
  config.colorPrintPricing["170g"] = [
    { min: 1, value: 11 },
    { min: 2, value: 9 },
  ];
  const separate = quote([
    { innerPaper: "Couche 170g" },
    { innerPaper: "Offset 170g" },
  ], config, "Somar quantidades").rows;
  assert.equal(separate[0].innerTotal, 11);
  assert.equal(separate[1].innerTotal, 11);

  const combined = quote([
    { innerPaper: "Couche 170g" },
    { innerPaper: "Couche 170g" },
  ], config, "Somar quantidades").rows;
  assert.equal(combined[0].innerTotal, 9);
  assert.equal(combined[1].innerTotal, 9);
});

test("preto e branco e jato de tinta ignoram o seletor de papel laser", () => {
  for (const printType of ["Preto e branco", "Colorido jato de tinta"]) {
    const standard = quote({ printType, innerPaper: "Sulfite 75g" }).rows[0];
    const alternate = quote({ printType, innerPaper: "Couche 250g" }).rows[0];
    assert.equal(alternate.innerTotal, standard.innerTotal);
    assert.equal(app.getApostilaInnerPaper(alternate), "Sulfite 75g");
  }
});

test("apostilas antigas recebem Sulfite 75g e presets aplicam o papel", () => {
  const state = app.mergeState({ rows: [{ printType: "Colorido laser", pages: 1, quantity: 1 }] });
  assert.equal(state.rows[0].innerPaper, "Sulfite 75g");
  const row = app.createDefaultRow(0);
  app.applyPresetToRow(row, { ...state.presets, printType: "Colorido laser", innerPaper: "Metalizado branco" });
  assert.equal(row.innerPaper, "Metalizado branco");
  assert.match(app.buildApostilaPrintDetail(row), /Miolo: Metalizado branco/);
});
