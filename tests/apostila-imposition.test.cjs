const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'app.mjs'), 'utf8')
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = { window: { BLOCK_CATALOG: [] }, Intl, URL, console };
vm.createContext(app);
vm.runInContext(source, app);

function calculate(fields, config = app.createDefaultConfig()) {
  const state = app.createDefaultState();
  state.rows = [{ ...app.createDefaultRow(0), ...fields }];
  return app.calculateWorkbook(state, config).rows[0];
}

test('A4/A3 usam a escolha de páginas por face, A5/A6 têm encaixe fixo', () => {
  for (const [size, pagesPerSheet, expected] of [
    ['A4', 1, 1], ['A4', 2, 2], ['A4', 4, 4], ['A4', 6, 6],
    ['A3', 1, 1], ['A3', 2, 2], ['A3', 4, 4], ['A3', 6, 6],
    ['A5', 1, 2], ['A5', 6, 2], ['A6', 1, 4], ['A6', 6, 4],
  ]) {
    const row = { size, pagesPerSheet };
    assert.equal(app.getApostilaInnerPagesPerSheet(row), expected, `${size}/${pagesPerSheet}`);
    assert.equal(app.hasAutomaticApostilaImposition(row), size === 'A5' || size === 'A6');
  }
  assert.equal(app.getApostilaInnerPagesPerSheet({ size: 'A4', finishing: 'Livreto', pagesPerSheet: 6 }), 2);
  assert.equal(app.hasAutomaticApostilaImposition({ size: 'A4', finishing: 'Livreto' }), true);
});

test('1, 2, 4 e 6 páginas por face reduzem impressões e folhas de encadernação', () => {
  for (const size of ['A4', 'A3']) {
    for (const [factor, impressions, bindingSheets] of [
      [1, 24, 12], [2, 12, 6], [4, 6, 3], [6, 4, 2],
    ]) {
      const row = calculate({
        size, pagesPerSheet: factor, pages: 24, quantity: 1,
        printMode: 'Frente e verso',
      });
      assert.equal(row.innerImpressions, impressions, `${size}/${factor} impressões`);
      assert.equal(row.bindingSheetsPerCopy, bindingSheets, `${size}/${factor} folhas`);
    }
  }
});

test('exemplo do print: A5, 16 páginas, duplex e 10 apostilas', () => {
  const config = app.createDefaultConfig();
  config.printPricing.blackWhite = [
    { min: 1, value: 2.5 }, { min: 2, value: 1.8 }, { min: 3, value: 0.25 },
  ];
  config.coverPricing['Papel couche 250g'] = [{ min: 1, value: 5 }];
  config.spiralPricing = [{ maxSheets: 50, rates: { '1': 5, '21': 5, '51': 5, '101': 5 } }];
  const row = calculate({
    size: 'A5', pagesPerSheet: 1, pages: 16, quantity: 10,
    printMode: 'Frente e verso', finishing: 'Encadernação espiral',
    coverType: 'Colorida so frente', coverPaper: 'Papel couche 250g',
  }, config);
  assert.equal(row.innerImpressions, 80);
  assert.equal(row.bindingSheetsPerCopy, 8);
  assert.equal(row.coverImpressions, 5);
  assert.equal(row.innerTotal, 20);
  assert.equal(row.coverTotal, 25);
  assert.equal(row.finishingTotal, 50);
  assert.equal(row.total, 95);
});

test('A5 e A6 compartilham a folha entre exemplares e espiral conta folhas cortadas', () => {
  const a5 = calculate({ size: 'A5', pages: 3, quantity: 10, printMode: 'Só frente' });
  assert.equal(a5.innerImpressions, 15);
  assert.equal(a5.bindingSheetsPerCopy, 3);
  const a6 = calculate({ size: 'A6', pages: 3, quantity: 10, printMode: 'Só frente' });
  assert.equal(a6.innerImpressions, 8);
  assert.equal(a6.bindingSheetsPerCopy, 3);

  const config = app.createDefaultConfig();
  config.spiralPricing = [
    { maxSheets: 50, rates: { '1': 4 } },
    { maxSheets: 100, rates: { '1': 8 } },
  ];
  for (const size of ['A5', 'A6']) {
    const row = calculate({
      size, pages: 120, quantity: 1, printMode: 'Frente e verso',
      finishing: 'Encadernação espiral',
    }, config);
    assert.equal(row.bindingSheetsPerCopy, 60);
    assert.equal(row.finishingTotal, 8);
  }
});
