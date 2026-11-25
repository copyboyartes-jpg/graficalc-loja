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

function m2Quote(mediaId, config = app.createDefaultConfig()) {
  const state = app.createDefaultState();
  state.m2Items = [{
    ...app.createDefaultM2Row(0),
    productId: "lona",
    description: "Faixa promocional",
    mediaId,
    widthMm: 100,
    heightMm: 100,
    quantity: 1,
  }];
  const workbook = app.calculateM2WorkbookFromConfig(state, config);
  const empty = () => ({ activeRows: [], totals: { totalGeneral: 0, totalQuantity: 0 } });
  const workbooks = Array.from({ length: 12 }, empty);
  workbooks[10] = workbook;
  return {
    state,
    workbook,
    html: app.createQuoteHtml(state, ...workbooks),
    text: app.createQuoteText(state, ...workbooks),
  };
}

test("as oito mídias aparecem no seletor e nas configurações", () => {
  const config = app.createDefaultConfig();
  const labels = [
    "Lona brilho",
    "Adesivo branco brilho",
    "Adesivo branco fosco",
    "Adesivo blackout Brilho",
    "Adesivo transparente brilho",
    "Adesivo jateado",
    "Chapa PS 1mm",
    "Chapa PS 2mm",
  ];
  assert.deepEqual(Array.from(config.m2Media, (item) => item.label), labels);
  const options = app.buildM2MediaOptions("adesivo-jateado", config);
  assert.match(options, /value="adesivo-jateado" selected/);
  const settings = app.createM2MediaMarkup(config.m2Media);
  assert.match(settings, /Adicionar mídia/);
  assert.equal((settings.match(/data-m2-media-index=/g) || []).length, 8);
  assert.match(app.buildM2MediaOptions("chapa-ps-1mm", config), /value="chapa-ps-1mm" selected/);
  assert.match(app.buildM2MediaOptions("chapa-ps-2mm", config), /value="chapa-ps-2mm" selected/);
});

test("a mídia escolhida aparece no orçamento sem alterar o cálculo", () => {
  const withMedia = m2Quote("lona-brilho");
  const withoutMedia = m2Quote("");
  assert.equal(withMedia.workbook.totals.totalGeneral, withoutMedia.workbook.totals.totalGeneral);
  assert.equal(withMedia.workbook.activeRows[0].mediaLabel, "Lona brilho");
  assert.match(withMedia.html, /Lona \| Mídia: Lona brilho/);
  assert.match(withMedia.text, /Mídia: Lona brilho \| R\$/);
  assert.doesNotMatch(withoutMedia.html, /Mídia:/);
  for (const [id, label] of [["chapa-ps-1mm", "Chapa PS 1mm"], ["chapa-ps-2mm", "Chapa PS 2mm"]]) {
    const result = m2Quote(id);
    assert.equal(result.workbook.totals.totalGeneral, withoutMedia.workbook.totals.totalGeneral);
    assert.match(result.html, new RegExp(`Mídia: ${label}`));
  }
});

test("mídia adicionada à configuração pode ser usada e mantém o nome no histórico", () => {
  const config = app.createDefaultConfig();
  config.m2Media.push({ id: "lona-fosca", label: "Lona fosca" });
  const savedConfig = app.mergeConfig(config);
  const result = m2Quote("lona-fosca", savedConfig);
  assert.match(result.html, /Mídia: Lona fosca/);
  result.state.m2Items[0].mediaLabel = "Lona fosca";
  const restored = app.mergeState(app.createQuoteHistorySnapshot(result.state));
  assert.equal(restored.m2Items[0].mediaId, "lona-fosca");
  assert.equal(restored.m2Items[0].mediaLabel, "Lona fosca");
  assert.equal(app.calculateM2WorkbookFromConfig(restored, { ...savedConfig, m2Media: [] }).activeRows[0].mediaLabel, "Lona fosca");
});

test("configurações anteriores recebem as mídias sem sobrescrever preços", () => {
  const oldConfig = app.createDefaultConfig();
  delete oldConfig.m2Media;
  oldConfig.m2Pricing.lona[1].value = 77;
  const merged = app.mergeConfig(oldConfig);
  assert.equal(merged.m2Media.length, 8);
  assert.equal(merged.m2Pricing.lona[1].value, 77);
  assert.equal(m2Quote("adesivo-branco-fosco", merged).workbook.activeRows[0].mediaLabel, "Adesivo branco fosco");
});

test("configurações existentes recebem as chapas sem duplicar mídias nem perder escolhas", () => {
  const oldConfig = app.createDefaultConfig();
  delete oldConfig.m2MediaPsVersion;
  oldConfig.m2Media = oldConfig.m2Media.filter((item) => !["adesivo-jateado", "chapa-ps-1mm", "chapa-ps-2mm"].includes(item.id));
  oldConfig.m2Media.push({ id: "ps-custom", label: "Chapa PS 1 mm" });
  oldConfig.m2Media.push({ id: "midia-custom", label: "Mídia personalizada" });
  const merged = app.mergeConfig(oldConfig);
  assert.equal(merged.m2Media.some((item) => item.id === "adesivo-jateado"), false);
  assert.equal(merged.m2Media.some((item) => item.id === "midia-custom"), true);
  assert.equal(merged.m2Media.some((item) => item.id === "chapa-ps-1mm"), false);
  assert.equal(merged.m2Media.filter((item) => /Chapa PS 1\s?mm/.test(item.label)).length, 1);
  assert.equal(merged.m2Media.some((item) => item.id === "chapa-ps-2mm"), true);
  assert.equal(app.mergeConfig(merged).m2Media.length, merged.m2Media.length);
  const edited = { ...merged, m2Media: merged.m2Media.filter((item) => item.id !== "chapa-ps-2mm") };
  assert.equal(app.mergeConfig(edited).m2Media.some((item) => item.id === "chapa-ps-2mm"), false);
});
