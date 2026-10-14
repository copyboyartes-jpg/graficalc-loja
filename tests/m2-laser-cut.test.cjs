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

function quote({ width = 100, height = 100, quantity = 1, grouped = false, rows = 1, selected = true } = {}) {
  const state = app.createDefaultState();
  state.m2CalcMode = grouped ? "Somar materiais iguais" : "Independente";
  state.m2Items = Array.from({ length: rows }, (_, index) => ({
    ...app.createDefaultM2Row(index),
    productId: "lona",
    widthMm: width,
    heightMm: height,
    quantity,
    finishIds: selected ? ["corte-lazer"] : [],
  }));
  return app.calculateM2WorkbookFromConfig(state, app.createDefaultConfig());
}

test("Corte lazer aparece como acabamento de área a R$ 10,00 por m²", () => {
  const config = app.createDefaultConfig();
  const finish = config.m2Finishes.find((item) => item.id === "corte-lazer");
  assert.equal(finish.label, "Corte lazer");
  assert.equal(finish.type, "area");
  assert.equal(finish.price, 10);
  const regular = quote({ selected: false });
  const cut = quote();
  assert.equal(cut.activeRows[0].configuredFinishExtraTotal, 10);
  assert.equal(cut.totals.totalGeneral - regular.totals.totalGeneral, 10);
  assert.match(cut.activeRows[0].finishSummary, /Corte lazer: 1 m²/);
});

test("corte acrescenta R$ 10,00/m² mesmo quando o produto usa valor mínimo", () => {
  const regular = quote({ width: 100, height: 10, selected: false });
  const cut = quote({ width: 100, height: 10 });
  assert.equal(regular.totals.totalGeneral, 30);
  assert.equal(cut.totals.totalGeneral, 31);
  assert.equal(cut.activeRows[0].laserCutExtraTotal, 1);
});

test("quantidade e soma de materiais iguais cobram a área total uma vez", () => {
  const multiple = quote({ width: 100, height: 10, quantity: 2 });
  assert.equal(multiple.totals.totalGeneral, 32);
  assert.equal(multiple.activeRows[0].laserCutExtraTotal, 2);
  const grouped = quote({ width: 100, height: 10, grouped: true, rows: 2 });
  assert.equal(grouped.totals.totalGeneral, 32);
  assert.equal(grouped.activeRows.reduce((sum, row) => sum + row.laserCutExtraTotal, 0), 2);
});

test("configuração antiga recebe o acabamento sem duplicar acabamentos renomeados", () => {
  const oldConfig = app.createDefaultConfig();
  oldConfig.m2Finishes = oldConfig.m2Finishes.filter((finish) => finish.id !== "corte-lazer");
  oldConfig.m2Finishes.find((finish) => finish.id === "laminacao").label = "Laminação personalizada";
  const merged = app.mergeConfig(oldConfig);
  assert.equal(merged.m2Finishes.filter((finish) => finish.id === "corte-lazer").length, 1);
  assert.equal(merged.m2Finishes.filter((finish) => finish.id === "laminacao").length, 1);
  assert.equal(merged.m2Finishes.find((finish) => finish.id === "laminacao").label, "Laminação personalizada");
});

test("preço do corte continua editável nas configurações", () => {
  const state = app.createDefaultState();
  state.m2Items = [{ ...app.createDefaultM2Row(0), productId: "lona", widthMm: 100, heightMm: 100, quantity: 1, finishIds: ["corte-lazer"] }];
  const config = app.createDefaultConfig();
  config.m2Finishes.find((finish) => finish.id === "corte-lazer").price = 12;
  const result = app.calculateM2WorkbookFromConfig(state, config);
  assert.equal(result.activeRows[0].laserCutExtraTotal, 12);
  assert.equal(result.totals.totalGeneral, 82);
});
