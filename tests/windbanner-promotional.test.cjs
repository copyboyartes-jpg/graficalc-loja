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

const completeId = 'Windbanner promocional 1,20m - tecido, haste e base';
const tallId = 'Wind banner promocional 2m';

test('windbanner completo de 1,50m usa os três novos preços unitários', () => {
  const config = app.createDefaultConfig();
  for (const [quantity, unitPrice] of [[1, 95], [2, 95], [3, 92], [9, 92], [10, 85]]) {
    const product = app.getReadyProductSelection(config, completeId, quantity);
    assert.equal(product.label, 'Wind Banner Promocional 1,50m');
    assert.equal(product.unitPrice, unitPrice);
    assert.equal(product.minQuantity, 1);
  }
  assert.equal(app.getReadyProductSelection(config, tallId, 1).unitPrice, 150);
  assert.equal(app.getReadyProductSelection(config, tallId, 1).label, 'Wind Banner Promocional 2,00m');
});

test('configurações anteriores recebem os novos preços sem perder descrições', () => {
  const previous = {
    readyProductPricing: {
      [completeId]: { minQuantity: 5, quoteDescription: 'Descrição personalizada', tiers: [{ min: 5, value: 110 }] },
      [tallId]: { unitPrice: 165, quoteDescription: 'Outra descrição personalizada' },
    },
  };
  const merged = app.mergeConfig(previous);
  assert.equal(merged.readyProductPricing[completeId].minQuantity, 1);
  assert.deepEqual(Array.from(merged.readyProductPricing[completeId].tiers, (tier) => tier.value), [95, 92, 85]);
  assert.equal(merged.readyProductPricing[completeId].quoteDescription, 'Descrição personalizada');
  assert.equal(merged.readyProductPricing[tallId].unitPrice, 150);
  assert.equal(merged.readyProductPricing[tallId].quoteDescription, 'Outra descrição personalizada');
  merged.readyProductPricing[tallId].unitPrice = 155;
  assert.equal(app.mergeConfig(merged).readyProductPricing[tallId].unitPrice, 155);
});
