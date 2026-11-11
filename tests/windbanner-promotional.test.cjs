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

test('opção de tecido e haste sai do catálogo e das configurações', () => {
  const removedId = 'Windbanner promocional 1,20m - tecido e haste';
  const config = app.mergeConfig({
    readyProductPricing: {
      [removedId]: { minQuantity: 3, tiers: [{ min: 3, value: 88 }] },
    },
  });
  assert.equal(config.readyProductPricing[removedId], undefined);
  assert.doesNotMatch(app.buildReadyProductOptions('', config), /Wind Banner Promocional 1,50m - tecido e haste/);
  assert.doesNotMatch(app.createReadyProductPricingMarkup(config.readyProductPricing), /Wind Banner Promocional 1,50m - tecido e haste/);
  assert.match(app.buildReadyProductOptions('', config), /Wind Banner Promocional 1,50m - somente tecido/);
  assert.match(app.buildReadyProductOptions('', config), /Wind Banner Promocional 1,50m/);
});

test('rascunho com produto removido pede nova seleção sem trocar ou cobrar outro item', () => {
  const removedId = 'Windbanner promocional 1,20m - tecido e haste';
  const state = app.createDefaultState();
  Object.assign(state.readyProductItems[0], { productType: removedId, quantity: 3, description: 'Pedido antigo' });
  const restored = app.mergeState(state);
  const result = app.calculateReadyProductWorkbook(restored, app.createDefaultConfig());
  assert.equal(result.rows[0].productType, removedId);
  assert.equal(result.rows[0].valid, false);
  assert.equal(result.rows[0].total, 0);
  assert.match(result.rows[0].warning, /produto foi removido/);
  assert.match(app.buildReadyProductOptions(removedId, app.createDefaultConfig()), /Produto removido — escolha outro/);
});
