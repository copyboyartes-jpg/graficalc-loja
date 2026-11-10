const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.join(__dirname, '..');
const app = { window: { BLOCK_CATALOG: [] }, Intl, URL, console };
vm.createContext(app);
const source = fs.readFileSync(path.join(root, 'app.mjs'), 'utf8')
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
vm.runInContext(source, app);
vm.runInContext(fs.readFileSync(path.join(root, 'blocos-data.js'), 'utf8'), app);

test('reajuste de 10% arredonda centavos e mantém tiragens e dimensões', () => {
  const config = app.createDefaultConfig();
  assert.equal(app.raisePriceTenPercent(1.95), 2.15);
  assert.equal(config.printPricing.laser[5].value, 1.65);
  assert.equal(config.printPricing.laser[5].min, 301);
  assert.equal(config.colorPrintSheetArea.widthMm, 210);
  assert.equal(config.m2Pricing.lona[0].value, 33);
  assert.equal(config.m2Pricing.lona[0].min, 1);
  assert.equal(config.credentialLanyardPricing.roundWhite2mm, 0.83);
});

test('catálogos fixos de cartões, panfletos e blocos são reajustados', () => {
  const card = vm.runInContext('BUSINESS_CARD_CATALOG[0]', app);
  const flyer = vm.runInContext('FLYER_CATALOG.find((item) => item.production === "Laser" && item.paper === "Couche 120g" && item.size === "10x14cm")', app);
  assert.equal(card.modes['Só frente'][0].total, 46.75);
  assert.equal(card.modes['Só frente'][0].quantity, 100);
  assert.equal(flyer.modes['Só frente'].find((tier) => tier.quantity === 1500).total, 599.5);
  assert.equal(app.window.BLOCK_CATALOG[0].price, 105.6);
  assert.equal(app.window.BLOCK_CATALOG[0].quantity, 6);
});

test('acabamentos e preço adicional fixo também recebem 10%', () => {
  assert.equal(app.calculateBusinessCardExtraFinishTotal(100, 'Com acabamento adicional'), 14.3);
  assert.equal(app.calculateBusinessCardExtraFinishTotal(1000, 'Com acabamento adicional'), 27.5);
  assert.equal(app.calculateFlyerFoldTotal(100, '1 dobra'), 16.5);
  assert.equal(app.calculateFlyerFoldTotal(1000, '2 dobras'), 110);
  assert.equal(app.getWholeLaminationUnit('a4', 1), 5.12);
  assert.equal(app.getWholeLaminationUnit('a3', 1), 11.44);
});
