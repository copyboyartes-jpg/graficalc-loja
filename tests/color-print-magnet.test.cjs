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

const material = "Ímã de geladeira";

function calculate({ size = "Tamanho personalizado", widthMm = 10, heightMm = 14, quantity = 1, printMode = "Só frente" } = {}, config = app.createDefaultConfig()) {
  const state = app.createDefaultState();
  Object.assign(state.colorPrintItems[0], {
    description: material,
    paperType: material,
    size,
    widthMm,
    heightMm,
    quantity,
    printMode,
  });
  return app.calculateColorPrintWorkbook(state, config);
}

test("ímã personalizado encaixa no A4 e usa a faixa pela quantidade de folhas", () => {
  const config = app.createDefaultConfig();
  config.colorPrintSheetArea = { widthMm: 100, heightMm: 100 };
  const one = calculate({}, config).rows[0];
  assert.equal(one.itemsPerSheet, 4);
  assert.equal(one.a4Sheets, 1);
  assert.equal(one.printTotal, 17.6);
  assert.equal(one.sheetSizeLabel, "A4");

  const ten = calculate({ quantity: 40 }, config).rows[0];
  assert.equal(ten.a4Sheets, 10);
  assert.equal(ten.printTotal, 176);

  const eleven = calculate({ quantity: 44 }, config).rows[0];
  assert.equal(eleven.a4Sheets, 11);
  assert.equal(eleven.printTotal, 176);
  assert.equal(eleven.printTotal / eleven.a4Sheets, 16);
});

test("ímã A4 inteiro mantém a tarifa e A3 custa o dobro", () => {
  assert.equal(calculate({ size: "A4" }).rows[0].printTotal, 17.6);
  assert.equal(calculate({ size: "A3" }).rows[0].printTotal, 35.2);
  assert.equal(calculate({ size: "A3", quantity: 11 }).rows[0].printTotal, 352);
  assert.equal(calculate({ size: "A4", quantity: 10, printMode: "Frente e verso" }).rows[0].printTotal, 352);
});

test("ímã personalizado que não cabe no A4 não recebe preço de impressão", () => {
  const workbook = calculate({ widthMm: 22, heightMm: 30 });
  assert.equal(workbook.rows[0].itemsPerSheet, 0);
  assert.equal(workbook.rows[0].printTotal, 0);
  assert.match(workbook.warnings.join(" "), /não cabe em uma folha A4/);
});

test("tabela do ímã aparece nas configurações e sobrevive à carga de configuração antiga", () => {
  const config = app.mergeConfig({ colorPrintPricing: { "170g": [{ min: 1, value: 9 }] } });
  assert.equal(config.colorPrintPricing[material][0].value, 17.6);
  assert.equal(config.colorPrintPricing[material][1].value, 16);
  const markup = app.createConfigSectionsMarkup(config, "basic", "impressos");
  assert.match(markup, /Ímã de geladeira/);
  assert.match(markup, /data-config-prefix="color-Ímã de geladeira"/);
});
