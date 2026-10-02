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
    size: "A3",
    pages: 1,
    quantity: 1,
    ...item,
  }));
  return app.calculateWorkbook(state, config);
}

test("A3 preto e branco usa todas as faixas por impressão", () => {
  for (const [quantity, unitPrice] of [
    [1, 2.5], [2, 1.8], [10, 1.8], [11, 0.8], [50, 0.8],
    [51, 0.55], [100, 0.55], [101, 0.5], [200, 0.5], [201, 0.45],
  ]) {
    const row = quote({ quantity }).rows[0];
    assert.ok(Math.abs(row.innerTotal - quantity * unitPrice) < 0.00001, `quantity ${quantity}`);
  }
});

test("A3 frente e verso cobra duas impressões e usa uma folha para encadernar", () => {
  const row = quote({ pages: 2, printMode: "Frente e verso" }).rows[0];
  assert.equal(row.blackWhiteImpressions, 2);
  assert.equal(row.innerTotal, 3.6);
  assert.equal(row.bindingSheetsPerCopy, 1);
});

test("A3 respeita páginas por folha para impressão e encadernação", () => {
  const row = quote({ pages: 4, pagesPerSheet: 2 }).rows[0];
  assert.equal(row.blackWhiteImpressions, 2);
  assert.equal(row.bindingSheetsPerCopy, 2);
  assert.equal(row.innerTotal, 3.6);
});

test("A3 laser e páginas coloridas usam a tabela A3 de sulfite", () => {
  const config = app.createDefaultConfig();
  config.colorPrintPricingA3["Sulfite 75g"] = [{ min: 1, value: 12 }];
  assert.equal(quote({ printType: "Colorido laser", pages: 2 }, config).rows[0].innerTotal, 24);
  assert.equal(quote({ pages: 2, colorPages: 1 }, config).rows[0].innerTotal, 14.5);
  assert.equal(quote({ printType: "Colorido laser", size: "A4", pages: 2 }, config).rows[0].innerTotal, 8);
});

test("capas A3 selecionam o papel certo e verso conta como duas impressões", () => {
  const row = quote({
    coverType: "Colorida frente e verso",
    coverPaper: "Papel couche 170g",
    backCoverType: "Colorida so frente",
    backCoverPaper: "Papel couche 250g",
  }).rows[0];
  assert.equal(row.coverImpressions, 2);
  assert.equal(row.coverTotal, 16);
  assert.equal(row.backImpressions, 1);
  assert.equal(row.backTotal, 8);
});

test("espiral A3 custa o dobro do A4, inclusive em grupo", () => {
  const a4 = quote({ size: "A4", pages: 40, quantity: 2, finishing: "Encadernação espiral" }).rows[0];
  const a3 = quote({ pages: 40, quantity: 2, finishing: "Encadernação espiral" }).rows[0];
  assert.equal(a3.finishingTotal, a4.finishingTotal * 2);

  const grouped = quote([
    { pages: 20, quantity: 2, finishing: "Encadernação espiral", bindingGroup: "A" },
    { pages: 20, quantity: 2, finishing: "Encadernação espiral", bindingGroup: "A" },
  ]).rows;
  assert.equal(grouped[0].finishingTotal, a3.finishingTotal);
  assert.equal(grouped[1].finishingTotal, 0);
});

test("livreto A3 mantém o mesmo valor e cálculo A4", () => {
  const fields = { pages: 8, quantity: 12, finishing: "Livreto" };
  const a4 = quote({ ...fields, size: "A4" }).rows[0];
  const a3 = quote(fields).rows[0];
  assert.equal(a3.finishingTotal, a4.finishingTotal);
  assert.equal(a3.finishingTotal, 18);
});

test("livreto A3 com 24 páginas laser couche 170 custa R$ 68", () => {
  const row = quote({
    printType: "Colorido laser",
    innerPaper: "Couche 170g",
    printMode: "Frente e verso",
    finishing: "Livreto",
    pages: 24,
    quantity: 1,
  }).rows[0];
  assert.equal(app.getApostilaInnerPagesPerSheet(row), 2);
  assert.equal(row.innerImpressions, 12);
  assert.equal(row.bindingSheetsPerCopy, 6);
  assert.equal(row.innerTotal, 66);
  assert.equal(row.finishingTotal, 2);
  assert.equal(row.total, 68);
  assert.match(app.getApostilaSizeDetail(row), /2 páginas por folha/);
});

test("livreto A4 também impõe duas páginas, sem mudar outros acabamentos", () => {
  const fields = { size: "A4", pages: 24, quantity: 1, pagesPerSheet: 1 };
  assert.equal(quote({ ...fields, finishing: "Livreto" }).rows[0].innerImpressions, 12);
  assert.equal(quote({ ...fields, finishing: "Sem acabamento" }).rows[0].innerImpressions, 24);
  assert.equal(quote({ ...fields, pagesPerSheet: 4, finishing: "Livreto" }).rows[0].innerImpressions, 12);
  assert.equal(quote({ ...fields, pagesPerSheet: 4, finishing: "Encadernação espiral" }).rows[0].innerImpressions, 6);
});

test("jato de tinta não aceita A3 nem em estado antigo", () => {
  assert.equal(app.getApostilaSizeOptions("Colorido jato de tinta").includes("A3"), false);
  const state = app.mergeState({ rows: [{ printType: "Colorido jato de tinta", size: "A3", quantity: 1, pages: 1 }] });
  assert.equal(state.rows[0].size, "A4");
  assert.equal(quote({ printType: "Colorido jato de tinta" }).rows[0].size, "A4");
});

test("agregação não mistura A3 com A4 e preserva A4/A5", () => {
  const rows = quote([
    { size: "A3", quantity: 1 },
    { size: "A4", quantity: 6 },
    { size: "A5", quantity: 4 },
  ], app.createDefaultConfig(), "Somar quantidades").rows;
  assert.equal(rows[0].innerTotal, 2.5);
  assert.ok(Math.abs(rows[1].innerTotal - 3.6) < 0.00001);
  assert.equal(rows[2].innerTotal, 2.4);
});

test("linhas A3 somam impressões entre si sem misturar preços de capa A4", () => {
  const rows = quote([
    { size: "A3", coverType: "Colorida so frente" },
    { size: "A3", coverType: "Colorida so frente" },
    { size: "A4", quantity: 4, coverType: "Colorida so frente" },
  ], app.createDefaultConfig(), "Somar quantidades").rows;
  assert.equal(rows[0].innerTotal, 1.8);
  assert.equal(rows[1].innerTotal, 1.8);
  assert.equal(rows[0].coverTotal, 7);
  assert.equal(rows[1].coverTotal, 7);
  assert.equal(rows[2].coverTotal, 16);
});

test("configuração antiga ganha tabela PB A3 sem alterar A4", () => {
  const config = app.mergeConfig({ printPricing: { blackWhite: [{ min: 1, value: 9, mode: "fixed" }] } });
  assert.equal(config.printPricing.blackWhiteA3.length, 6);
  assert.equal(config.printPricing.blackWhite[0].value, 9);
  assert.equal(app.getConfigArrayByPrefix(config, "bw-a3"), config.printPricing.blackWhiteA3);
});
