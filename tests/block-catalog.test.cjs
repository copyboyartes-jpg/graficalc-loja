const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const context = { window: {}, Intl, URL, console };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'blocos-data.js'), 'utf8'), context);
const appSource = fs.readFileSync(path.join(root, 'app.mjs'), 'utf8')
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
vm.runInContext(appSource, context);

test('tabela de blocos contém todas as combinações e preços exatos do PDF', () => {
  const catalog = context.window.BLOCK_CATALOG;
  assert.equal(catalog.filter((item) => item.tab === 'sulfite').length, 234);
  assert.equal(catalog.filter((item) => item.tab === 'autocopiativo').length, 84);
  assert.equal(new Set(catalog.map((item) => item.id)).size, 318);
  assert.ok(catalog.every((item) => item.price > 0));
  const price = (tab, format, vias, quantity) =>
    catalog.find((item) => item.tab === tab && item.format === format && item.vias === vias && item.quantity === quantity)?.price;
  assert.equal(price('sulfite', 'A4', 1, 6), 96);
  assert.equal(price('sulfite', 'Rifa 20x5,8cm (5 por folha) - 10 folhas', 1, 400), 304);
  assert.equal(price('autocopiativo', 'A4', 2, 3), 167);
  assert.equal(price('autocopiativo', 'A5', 3, 80), 2171);
  assert.equal(price('autocopiativo', '20,4x9,2cm', 2, 150), 1629);
  assert.equal(price('autocopiativo', 'A6', 3, 200), 2594);
});

test('cálculo mostra papel, folhas e acabamento incluído, com arte a partir de R$ 35', () => {
  const state = {
    blockItems: {
      sulfite: [{
        description: 'Rifa',
        format: 'rifa 20x5,7 (5 por folha) - 10 folhas',
        vias: 1,
        quantity: 400,
        artCreationFee: 10,
        discountType: 'R$',
        discountValue: 0,
      }],
      autocopiativo: [{
        description: 'Pedido',
        format: 'A5',
        vias: 2,
        quantity: 6,
        artCreationFee: 0,
        discountType: 'R$',
        discountValue: 0,
      }],
    },
  };
  const rifa = context.calculateBlockWorkbook(state, 'sulfite').activeRows[0];
  assert.equal(rifa.format, 'Rifa 20x5,8cm (5 por folha) - 10 folhas');
  assert.equal(rifa.sheetsPerBlock, 10);
  assert.equal(rifa.baseTotal, 304);
  assert.equal(rifa.total, 339);
  assert.match(context.getBlockQuoteDetail(rifa, 'Papel sulfite 75g'), /10 folhas por bloco.*Papel sulfite 75g.*capa 120g, impressão preta, cola, picote e numeração/);
  const auto = context.calculateBlockWorkbook(state, 'autocopiativo').activeRows[0];
  assert.equal(auto.baseTotal, 167);
  assert.equal(auto.total, 167);
  assert.equal(auto.measure, '14,4x20cm');
  assert.equal(auto.sheetsPerBlock, 50);
});
