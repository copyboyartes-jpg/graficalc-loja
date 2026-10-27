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

function quote({ meters = 0, widthCm = 0, heightCm = 0, quantity = 0, config = app.createDefaultConfig() } = {}) {
  const state = app.createDefaultState();
  state.linearMeterItems = [{
    ...app.createDefaultLinearMeterRow(0),
    productType: "magneto-automotivo",
    linearMeters: meters,
    widthCm,
    heightCm,
    quantity,
  }];
  return app.calculateLinearMeterWorkbook(state, config);
}

test("magneto automotivo aparece na aba e nas configurações", () => {
  const config = app.createDefaultConfig();
  const product = app.getLinearMeterProduct("magneto-automotivo", config);
  assert.equal(product.label, "Magneto automotivo");
  assert.equal(product.minimumOrder, 55);
  assert.equal(product.rate, 164);
  assert.equal(product.widthLabel, "");
  assert.match(app.buildLinearMeterProductOptions(product.id, config), /value="magneto-automotivo" selected/);
  const settings = app.createConfigSectionsMarkup(config, "advanced", "metro-linear");
  assert.match(settings, /products\.magneto-automotivo\.minimumOrder/);
  assert.match(settings, /products\.magneto-automotivo\.rate/);
  assert.match(settings, /products\.magneto-automotivo\.widthLabel/);
});

test("metragem direta respeita mínimo e preço por metro", () => {
  assert.equal(quote({ meters: 0.25 }).totals.totalGeneral, 55);
  assert.equal(quote({ meters: 1 }).totals.totalGeneral, 164);
  assert.equal(quote({ meters: 2 }).totals.totalGeneral, 328);
});

test("configuração antiga recebe o produto e preços editados entram no cálculo", () => {
  const oldConfig = app.createDefaultConfig();
  delete oldConfig.linearMeterPricing.products["magneto-automotivo"];
  const restored = app.mergeConfig(oldConfig);
  assert.equal(quote({ meters: 1, config: restored }).totals.totalGeneral, 164);
  restored.linearMeterPricing.products["magneto-automotivo"].rate = 180;
  restored.linearMeterPricing.products["magneto-automotivo"].minimumOrder = 60;
  assert.equal(quote({ meters: 0.2, config: restored }).totals.totalGeneral, 60);
  assert.equal(quote({ meters: 1, config: restored }).totals.totalGeneral, 180);
});

test("largura configurada permite calcular o encaixe das peças", () => {
  const config = app.createDefaultConfig();
  const missing = quote({ widthCm: 50, heightCm: 100, quantity: 2, config });
  assert.equal(missing.activeRows.length, 0);
  assert.match(missing.warnings[0], /configure a largura do material/);

  config.linearMeterPricing.products["magneto-automotivo"].widthLabel = "60 cm";
  const result = quote({ widthCm: 30, heightCm: 100, quantity: 2, config });
  assert.equal(result.activeRows[0].columns, 2);
  assert.equal(result.activeRows[0].linearMeters, 1);
  assert.equal(result.totals.totalGeneral, 164);
});
