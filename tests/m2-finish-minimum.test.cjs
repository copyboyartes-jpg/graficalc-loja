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

function quote({ rows = [{ width: 60, height: 40, quantity: 1, finishIds: ["laminacao"] }], grouped = false, config = app.createDefaultConfig() } = {}) {
  const state = app.createDefaultState();
  state.m2CalcMode = grouped ? "Somar materiais iguais" : "Independente";
  state.m2Items = rows.map((row, index) => ({
    ...app.createDefaultM2Row(index),
    productId: "flat-cut",
    widthMm: row.width,
    heightMm: row.height,
    quantity: row.quantity,
    finishIds: row.finishIds,
  }));
  return app.calculateM2WorkbookFromConfig(state, config);
}

test("mínimo do adesivo e mínimo da laminação são cobrados separadamente", () => {
  const result = quote();
  assert.equal(result.activeRows[0].minimumApplied, true);
  assert.equal(result.activeRows[0].configuredFinishExtraTotal, 10);
  assert.equal(result.totals.totalGeneral, 40);
});

test("acabamentos adicionais são somados depois do mínimo do material", () => {
  const result = quote({ rows: [{ width: 60, height: 40, quantity: 1, finishIds: ["laminacao", "corte-lazer"] }] });
  assert.equal(result.activeRows[0].configuredFinishExtraTotal, 12.4);
  assert.equal(result.totals.totalGeneral, 42.4);
});

test("mínimo da laminação vale para a linha inteira e não para cada unidade", () => {
  const result = quote({ rows: [{ width: 60, height: 40, quantity: 2, finishIds: ["laminacao"] }] });
  assert.equal(result.activeRows[0].configuredFinishExtraTotal, 12);
  assert.equal(result.totals.totalGeneral, 45.6);
});

test("materiais iguais compartilham mínimo do material, mantendo acabamento de cada linha", () => {
  const rows = Array.from({ length: 2 }, () => ({ width: 20, height: 50, quantity: 1, finishIds: ["laminacao"] }));
  const result = quote({ rows, grouped: true });
  assert.equal(result.activeRows[0].configuredFinishExtraTotal, 10);
  assert.equal(result.activeRows[1].configuredFinishExtraTotal, 10);
  assert.equal(result.totals.totalGeneral, 50);
});

test("configuração antiga recebe mínimo da laminação sem perder o preço configurado", () => {
  const oldConfig = app.createDefaultConfig();
  const lamination = oldConfig.m2Finishes.find((finish) => finish.id === "laminacao");
  lamination.price = 35;
  delete lamination.minimumPrice;
  const merged = app.mergeConfig(oldConfig);
  const restored = merged.m2Finishes.find((finish) => finish.id === "laminacao");
  assert.equal(restored.price, 35);
  assert.equal(restored.minimumPrice, 10);
  assert.equal(quote({ config: merged }).totals.totalGeneral, 40);
});
