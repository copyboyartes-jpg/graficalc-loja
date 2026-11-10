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

test('todas as tiragens de cartões e panfletos aparecem como preços editáveis', () => {
  const config = app.createDefaultConfig();
  const cardMarkup = app.createConfigSectionsMarkup(config, 'advanced', 'cartoes');
  const flyerMarkup = app.createConfigSectionsMarkup(config, 'advanced', 'panfletos');
  const cardCount = vm.runInContext('BUSINESS_CARD_CATALOG.reduce((sum, product) => sum + Object.values(product.modes).flat().length, 0)', app);
  const flyerCount = vm.runInContext('FLYER_CATALOG.reduce((sum, product) => sum + Object.values(product.modes).flat().length, 0)', app);
  assert.equal((cardMarkup.match(/data-config-prefix="business-card-price"/g) || []).length, cardCount);
  assert.equal((flyerMarkup.match(/data-config-prefix="flyer-price"/g) || []).length, flyerCount);
  assert.match(cardMarkup, /data-config-mode="Frente e verso"/);
  assert.match(flyerMarkup, /Laser \| Couche 120g \| 10x14cm/);
});

test('preços salvos alimentam cálculos e opções de quantidade', () => {
  const card = app.getBusinessCardMaterials('Laser')[0];
  const flyer = app.getFlyerCatalogByProduction('Laser').find((item) => item.paper === 'Couche 120g' && item.size === '10x14cm');
  const config = app.mergeConfig({
    businessCardPricing: { [card.id]: { 'Só frente': { 100: 59.95 } } },
    flyerPricing: { [flyer.id]: { 'Frente e verso': { 1500: 1199.9 } } },
  });
  const state = app.createDefaultState();
  Object.assign(state.businessCardItems[0], { description: 'Cartão', materialId: card.id, quantity: 100 });
  Object.assign(state.flyerItems[0], {
    description: 'Panfleto', catalogId: flyer.id, productionType: 'Laser', printMode: 'Frente e verso', quantity: 1500,
  });
  assert.equal(app.calculateBusinessCardWorkbook(state, config).activeRows[0].baseTotal, 59.95);
  assert.equal(app.calculateFlyerWorkbook(state, config).activeRows[0].baseTotal, 1199.9);
  assert.match(app.buildBusinessCardQuantityOptions(card, 'Só frente', 100, config), /R\$\s*59,95/);
  assert.match(app.buildFlyerQuantityOptions(flyer, 'Frente e verso', 1500, config), /R\$\s*1\.199,90/);
});

test('configuração antiga recebe os preços atuais e ignora valores inválidos', () => {
  const card = app.getBusinessCardMaterials('Laser')[0];
  const flyer = app.getFlyerCatalogByProduction('Laser').find((item) => item.paper === 'Couche 120g' && item.size === '10x14cm');
  const old = app.mergeConfig({ printPricing: { laser: app.createDefaultConfig().printPricing.laser } });
  assert.equal(old.businessCardPricing[card.id]['Só frente'][100], 46.75);
  assert.equal(old.flyerPricing[flyer.id]['Só frente'][1500], 599.5);
  const invalid = app.mergeConfig({ businessCardPricing: { [card.id]: { 'Só frente': { 100: -1 } } } });
  assert.equal(invalid.businessCardPricing[card.id]['Só frente'][100], 46.75);
});
