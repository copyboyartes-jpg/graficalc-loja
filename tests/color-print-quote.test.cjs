const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = {
  window: { BLOCK_CATALOG: [] },
  document: { getElementById: () => ({ innerHTML: "" }) },
  Intl,
  URL,
  console,
};
vm.createContext(app);
vm.runInContext(source, app);

function quote(row) {
  const emptyWorkbook = () => ({ activeRows: [], totals: { totalGeneral: 0, totalQuantity: 0 } });
  const workbooks = Array.from({ length: 12 }, emptyWorkbook);
  workbooks[1] = {
    activeRows: [row],
    totals: { totalGeneral: row.total, totalQuantity: row.quantity },
  };
  const args = [app.createDefaultState(), ...workbooks];
  return {
    html: app.createQuoteHtml(...args),
    text: app.createQuoteText(...args),
  };
}

test("orçamento personalizado mostra descrição, quantidade, medidas, papel e impressão nessa ordem", () => {
  const { html, text } = quote({
    description: "Cartaz",
    quantity: 50,
    size: "Tamanho personalizado",
    widthMm: 10,
    heightMm: 14,
    paperType: "Couche 170g",
    printMode: "Só frente",
    total: 37.75,
  });

  assert.match(html, /<strong>Cartaz<\/strong>\s*<small>\s*50 unidades \| 10 x 14 cm \| Couche 170g \| Só frente\s*<\/small>/);
  assert.match(text, /- Cartaz \| 50 unidades \| 10 x 14 cm \| Couche 170g \| Só frente \| R\$\s+37,75/);
  assert.doesNotMatch(html, /Tamanho personalizado|Impresso colorido \|/);
  assert.doesNotMatch(text, /Tamanho personalizado/);
});

test("tamanhos A4 e A3 continuam identificados, inclusive frente e verso", () => {
  for (const size of ["A4", "A3"]) {
    const { html, text } = quote({
      description: "Material de evento",
      quantity: 2,
      size,
      paperType: "Offset 120g",
      printMode: "Frente e verso",
      total: 20,
    });
    assert.match(html, new RegExp(`2 unidades \\| ${size} \\| Offset 120g \\| Frente e verso`));
    assert.match(text, new RegExp(`2 unidades \\| ${size} \\| Offset 120g \\| Frente e verso`));
  }
});
