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
    productType: "tecido-microfibra-extra",
    linearMeters: meters,
    widthCm,
    heightCm,
    quantity,
  }];
  return app.calculateLinearMeterWorkbook(state, config);
}

test("microfibra extra aparece com largura fixa e preços configuráveis", () => {
  const config = app.createDefaultConfig();
  const product = app.getLinearMeterProduct("tecido-microfibra-extra", config);
  assert.equal(product.label, "Tecido microfibra extra 155g/m");
  assert.equal(product.widthLabel, "1,55 m");
  assert.equal(product.minimumOrder, 25);
  assert.equal(product.rateUpTo3m, 71.5);
  assert.equal(product.rateAbove3m, 60.5);
  assert.match(app.buildLinearMeterProductOptions(product.id, config), /value="tecido-microfibra-extra" selected/);
  const settings = app.createConfigSectionsMarkup(config, "advanced", "metro-linear");
  assert.match(settings, /products\.tecido-microfibra-extra\.minimumOrder/);
  assert.match(settings, /products\.tecido-microfibra-extra\.rateUpTo3m/);
  assert.match(settings, /products\.tecido-microfibra-extra\.rateAbove3m/);
});

test("microfibra respeita mínimo e faixas até e acima de 3 metros", () => {
  assert.equal(quote({ meters: 0.2 }).totals.totalGeneral, 25);
  assert.equal(quote({ meters: 1 }).totals.totalGeneral, 71.5);
  assert.equal(quote({ meters: 3 }).totals.totalGeneral, 214.5);
  assert.equal(quote({ meters: 4 }).totals.totalGeneral, 242);
});

test("microfibra aproveita peças na largura fixa antes de selecionar a faixa", () => {
  const result = quote({ widthCm: 50, heightCm: 100, quantity: 3 });
  const row = result.activeRows[0];
  assert.equal(row.materialWidthCm, 155);
  assert.equal(row.columns, 3);
  assert.equal(row.rows, 1);
  assert.equal(row.linearMeters, 1);
  assert.equal(row.baseTotal, 71.5);
  assert.equal(quote({ widthCm: 160, heightCm: 200, quantity: 1 }).activeRows.length, 0);
});

test("configuração antiga recebe a microfibra e preços editados entram no cálculo", () => {
  const oldConfig = app.createDefaultConfig();
  delete oldConfig.linearMeterPricing.products["tecido-microfibra-extra"];
  assert.equal(quote({ meters: 1, config: app.mergeConfig(oldConfig) }).totals.totalGeneral, 71.5);

  const config = app.createDefaultConfig();
  config.linearMeterPricing.products["tecido-microfibra-extra"].rateAbove3m = 65;
  assert.equal(quote({ meters: 4, config }).totals.totalGeneral, 260);
});

test("visualização mostra peças, sobra lateral e última fileira parcial", () => {
  const row = quote({ widthCm: 50, heightCm: 100, quantity: 4 }).activeRows[0];
  const html = app.createLinearMeterLayoutMarkup(row, 0);
  assert.equal(row.columns, 3);
  assert.equal(row.rows, 2);
  assert.match(html, /viewBox="0 0 155 200"/);
  assert.match(html, /<rect width="150" height="100" fill="url\(#linear-layout-piece-0\)"/);
  assert.match(html, /<rect y="100" width="50" height="100" fill="url\(#linear-layout-piece-0\)"/);
  assert.match(html, /sobra lateral de 5 cm/);
  assert.match(html, /Encaixe completo/);
});

test("visualização acompanha rotação e limita desenhos muito longos", () => {
  const rotated = quote({ widthCm: 100, heightCm: 50, quantity: 3 }).activeRows[0];
  assert.equal(rotated.rotated, true);
  assert.match(app.createLinearMeterLayoutMarkup(rotated, 0), /3 por fileira · 1 fileira · girado 90°/);

  const longRow = quote({ widthCm: 50, heightCm: 100, quantity: 100 }).activeRows[0];
  const html = app.createLinearMeterLayoutMarkup(longRow, 0);
  assert.match(html, /Primeiras 4 de 34 fileiras/);
  assert.match(html, /<rect width="150" height="400" fill="url\(#linear-layout-piece-0\)"/);
});

test("visualização orienta quando faltam medidas e não exibe itens vazios", () => {
  const row = quote({ widthCm: 160, heightCm: 200, quantity: 1 }).rows[0];
  assert.match(app.createLinearMeterLayoutMarkup(row, 0), /a peça não cabe na largura/);
  assert.match(app.createLinearMeterLayoutsMarkup([row]), /Item 01/);
  assert.match(app.createLinearMeterLayoutsMarkup([]), /Preencha uma linha na tabela/);
});
