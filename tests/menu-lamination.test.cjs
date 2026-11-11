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

function menuRow(overrides = {}) {
  return {
    ...app.createDefaultRow(0),
    productType: 'Cardápio plastificado',
    printType: 'Colorido laser',
    size: 'A5',
    finishing: 'Encadernação espiral',
    description: 'Cardápio',
    pages: 2,
    quantity: 1,
    ...overrides,
  };
}

function calculate(row, config = app.createDefaultConfig()) {
  const state = app.createDefaultState();
  state.rows[0] = row;
  return app.calculateWorkbook(state, config);
}

test('cardápio A5 usa duas páginas por impressão e duas folhas por Polaseal', () => {
  const config = app.createDefaultConfig();
  const row = calculate(menuRow(), config).activeRows[0];
  assert.equal(row.innerImpressions, 1);
  assert.equal(row.bindingSheetsPerCopy, 2);
  assert.equal(row.menuPolasealCount, 1);
  assert.equal(row.finishingTotal, 3.5);
  assert.equal(row.menuLaminationTotal, config.colorPrintExtras.laminationWhole.a4[0].value);
  assert.equal(row.total, row.innerTotal + row.menuLaminationTotal + row.finishingTotal);
});

test('A5 compartilha a impressão e o Polaseal entre exemplares, sem capas desconta R$ 0,75', () => {
  const row = calculate(menuRow({ pages: 1, quantity: 3, spiralOption: 'Sem capas plásticas' })).activeRows[0];
  assert.equal(row.innerImpressions, 2);
  assert.equal(row.menuPolasealCount, 2);
  assert.equal(row.finishingUnit, 2.75);
  assert.equal(row.finishingTotal, 8.25);
});

test('A5 frente e verso imprime duas passadas e aproveita duas peças em cada lado', () => {
  const one = calculate(menuRow({ pages: 2, printMode: 'Frente e verso' })).activeRows[0];
  assert.equal(one.innerImpressions, 2);
  assert.equal(one.bindingSheetsPerCopy, 1);
  assert.equal(one.menuPolasealCount, 1);
  const three = calculate(menuRow({ pages: 2, quantity: 3, printMode: 'Frente e verso' })).activeRows[0];
  assert.equal(three.innerImpressions, 4);
  assert.equal(three.menuPolasealCount, 2);
});

test('A4 duplex plastifica a folha física e desconta R$ 1,50 sem capas', () => {
  const config = app.createDefaultConfig();
  const row = calculate(menuRow({ size: 'A4', pages: 2, printMode: 'Frente e verso', spiralOption: 'Sem capas plásticas' }), config).activeRows[0];
  assert.equal(row.innerImpressions, 2);
  assert.equal(row.bindingSheetsPerCopy, 1);
  assert.equal(row.menuPolasealCount, 1);
  assert.equal(row.finishingUnit, config.spiralPricing[0].rates['1'] - 1.5);
});

test('somente capas plastifica apenas as capas impressas e informa quando não há capas', () => {
  const withCover = calculate(menuRow({ quantity: 3, menuLaminationScope: 'Somente capas', coverType: 'Colorida so frente' }));
  assert.equal(withCover.activeRows[0].menuPolasealCount, 2);
  const withoutCover = calculate(menuRow({ menuLaminationScope: 'Somente capas' }));
  assert.equal(withoutCover.activeRows[0].menuLaminationTotal, 0);
  assert.match(withoutCover.warnings.join(' '), /escolha capa ou contracapa/);
});

test('arquivos do mesmo grupo compartilham o Polaseal e uma encadernação', () => {
  const state = app.createDefaultState();
  state.rows[0] = menuRow({ pages: 1, bindingGroup: 'Menu' });
  state.rows[1] = menuRow({ pages: 1, bindingGroup: 'Menu' });
  const rows = app.calculateWorkbook(state, app.createDefaultConfig()).activeRows;
  assert.equal(rows[0].menuPolasealCount, 1);
  assert.equal(rows[1].menuPolasealCount, 0);
  assert.equal(rows[0].finishingTotal, 3.5);
  assert.equal(rows[1].finishingTotal, 0);
});

test('cardápio e apostila com o mesmo nome de grupo não dividem a encadernação', () => {
  const state = app.createDefaultState();
  state.rows[0] = menuRow({ pages: 1, bindingGroup: 'Grupo A' });
  Object.assign(state.rows[1], { description: 'Apostila', pages: 1, quantity: 1, finishing: 'Encadernação espiral', bindingGroup: 'Grupo A' });
  const workbook = app.calculateWorkbook(state, app.createDefaultConfig());
  assert.ok(workbook.rows[0].finishingTotal > 0);
  assert.ok(workbook.rows[1].finishingTotal > 0);
  assert.match(workbook.warnings.join(' '), /encadernados separadamente/);
});

test('configurações e orçamentos antigos permanecem com o cálculo de apostila', () => {
  const config = app.mergeConfig({});
  assert.equal(config.menuPricing.a5Binding, 3.5);
  assert.equal(config.menuPricing.a5NoPlasticCoverDiscount, 0.75);
  const old = app.createDefaultState();
  delete old.rows[0].productType;
  const restored = app.mergeState(old);
  assert.equal(restored.rows[0].productType, 'Apostila');
  assert.equal(app.calculateWorkbook(restored, config).rows[0].menuLaminationTotal, 0);
  assert.match(app.createConfigSectionsMarkup(config, 'advanced', 'calculo'), /data-config-key="a5Binding"/);
  assert.match(source, /name="menuLaminationScope"/);
});

test('preços editados de encadernação e plastificação entram no cardápio', () => {
  const config = app.mergeConfig({ menuPricing: { a5Binding: 4.25, a5NoPlasticCoverDiscount: 1 } });
  config.colorPrintExtras.laminationWhole.a4[0].value = 6;
  const row = calculate(menuRow({ spiralOption: 'Sem capas plásticas' }), config).activeRows[0];
  assert.equal(row.finishingTotal, 3.25);
  assert.equal(row.menuLaminationTotal, 6);
});

test('orçamento identifica cardápio, plastificação e capas plásticas', () => {
  const workbook = calculate(menuRow({ spiralOption: 'Sem capas plásticas' }));
  const empty = { activeRows: [] };
  const entry = app.collectQuoteEntries(workbook, ...Array(11).fill(empty))[0];
  assert.equal(entry.kind, 'Cardápio plastificado');
  assert.match(entry.detail, /1 cardápio/);
  assert.match(entry.detail, /Plastificação de todas as folhas/);
  assert.match(entry.detail, /Sem capas plásticas/);
});
