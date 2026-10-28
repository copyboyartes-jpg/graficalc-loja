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

function quote(items, grouped = false) {
  const state = app.createDefaultState();
  state.linearMeterCalcMode = grouped ? "Juntar mesma base" : "Independente";
  state.linearMeterItems = items.map((item, index) => ({
    ...app.createDefaultLinearMeterRow(index),
    productType: "magneto-automotivo",
    ...item,
  }));
  return app.calculateLinearMeterWorkbook(state, app.createDefaultConfig());
}

test("duas medidas de magneto compartilham o encaixe quando selecionado", () => {
  const items = [
    { widthCm: 15, heightCm: 30, quantity: 5 },
    { widthCm: 10, heightCm: 15, quantity: 10 },
  ];
  const separate = quote(items);
  const joined = quote(items, true);
  assert.equal(separate.totals.totalQuantity, 0.75);
  assert.equal(separate.groupLayouts.length, 0);
  assert.equal(joined.groupLayouts.length, 1);
  assert.equal(joined.totals.totalQuantity, 0.65);
  assert.equal(joined.groupLayouts[0].placements.length, 15);
  for (const [position, piece] of joined.groupLayouts[0].placements.entries()) {
    assert.ok(piece.x >= 0 && piece.y >= 0);
    assert.ok(piece.x + piece.width <= 60);
    assert.ok(piece.y + piece.height <= 65);
    for (const other of joined.groupLayouts[0].placements.slice(position + 1)) {
      const overlapping = piece.x < other.x + other.width && piece.x + piece.width > other.x
        && piece.y < other.y + other.height && piece.y + piece.height > other.y;
      assert.equal(overlapping, false);
    }
  }
  assert.equal(joined.activeRows.reduce((sum, row) => sum + row.total, 0), joined.totals.totalGeneral);
  assert.equal(joined.totals.totalGeneral, 106.6);
  const html = app.createLinearMeterLayoutsMarkup(joined.rows, joined.groupLayouts);
  assert.match(html, /Base compartilhada/);
  assert.match(html, /Item 01/);
  assert.match(html, /Item 02/);
});

test("valor mínimo é cobrado uma vez no grupo", () => {
  const items = Array.from({ length: 2 }, () => ({ widthCm: 10, heightCm: 10, quantity: 1 }));
  assert.equal(quote(items).totals.totalGeneral, 110);
  const joined = quote(items, true);
  assert.equal(joined.totals.totalQuantity, 0.1);
  assert.equal(joined.totals.totalGeneral, 55);
  assert.equal(joined.activeRows[0].baseTotal + joined.activeRows[1].baseTotal, 55);
});

test("itens de materiais e tabelas diferentes permanecem separados", () => {
  const material = quote([
    { productType: "magneto-automotivo", linearMeters: 0.5 },
    { productType: "canvas", linearMeters: 0.5 },
  ], true);
  assert.equal(material.groupLayouts.length, 0);
  assert.equal(material.totals.totalQuantity, 1);

  const table = quote([
    { productType: "dtf-textil", variantType: "2-dias", linearMeters: 0.5 },
    { productType: "dtf-textil", variantType: "hoje", linearMeters: 0.5 },
  ], true);
  assert.equal(table.groupLayouts.length, 0);
});

test("metragem direta compartilha faixa e preço sem perder edição da linha", () => {
  const joined = quote([{ linearMeters: 0.25 }, { linearMeters: 0.25 }], true);
  assert.equal(joined.totals.totalQuantity, 0.5);
  assert.equal(joined.totals.totalGeneral, 82);
  assert.equal(joined.rows[0].linearMeters, 0.25);
  assert.equal(joined.rows[1].linearMeters, 0.25);
});

test("DTF usa a tabela da metragem conjunta e mantém arte e desconto por item", () => {
  const joined = quote([
    { productType: "dtf-textil", variantType: "2-dias", linearMeters: 0.5, artCreationFee: 5 },
    { productType: "dtf-textil", variantType: "2-dias", linearMeters: 0.5, discountValue: 10 },
  ], true);
  assert.equal(joined.totals.totalQuantity, 1);
  assert.equal(joined.activeRows[0].baseTotal + joined.activeRows[1].baseTotal, 50);
  assert.equal(joined.totals.totalGeneral, 45);
});

test("modo de cálculo é salvo no histórico e orçamentos antigos continuam independentes", () => {
  const state = app.createDefaultState();
  state.linearMeterCalcMode = "Juntar mesma base";
  const snapshot = app.createQuoteHistorySnapshot(state);
  const restored = app.createDefaultState();
  app.applyQuoteHistorySnapshot(restored, snapshot);
  assert.equal(restored.linearMeterCalcMode, "Juntar mesma base");
  assert.equal(app.mergeState({ linearMeterItems: state.linearMeterItems }).linearMeterCalcMode, "Independente");
});
