const STORAGE_KEYS = {
  state: "copyboy-apostilas-state-v1",
  config: "copyboy-apostilas-config-v1",
};

const OPTIONS = {
  printTypes: ["Preto e branco", "Colorido jato de tinta", "Colorido laser"],
  sizes: ["A4", "A5"],
  printModes: ["So frente", "Frente e verso"],
  bleedModes: ["Sem sangra", "Com sangra"],
  finishing: ["Sem acabamento", "Encadernacao espiral", "Livreto"],
  coverTypes: ["Sem capa", "Colorida so frente", "Colorida frente e verso"],
  backCoverTypes: ["Sem contracapa", "Colorida so frente", "Colorida frente e verso"],
  coverPapers: ["Sulfite 75g", "Papel couche 170g", "Papel couche 250g", "Papel couche 300g"],
  colorPaperTypes: [
    "Sulfite 75g",
    "Offset 120g",
    "Couche 170g",
    "Offset 170g",
    "Reciclato 170g",
    "Couche 250g",
    "Offset 240g",
    "Reciclato 240g",
    "Couche 300g",
    "Metalizado branco",
    "Metalizado amarelo",
  ],
  spiralOptions: ["Completa", "Sem capas plasticas"],
  calcModes: ["Independente", "Somar quantidades"],
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

function createDefaultConfig() {
  return {
    printPricing: {
      blackWhite: [
        { min: 1, value: 2.0, mode: "fixed" },
        { min: 2, value: 3.0, mode: "fixed" },
        { min: 3, value: 1.0, mode: "unit" },
        { min: 6, value: 0.6, mode: "unit" },
        { min: 11, value: 0.3, mode: "unit" },
        { min: 51, value: 0.2, mode: "unit" },
        { min: 100, value: 0.18, mode: "unit" },
        { min: 1000, value: 0.13, mode: "unit" },
        { min: 10000, value: 0.12, mode: "unit" },
      ],
      inkjet: [
        { min: 1, value: 2.0, label: "1 a 10" },
        { min: 11, value: 1.5, label: "11 a 20" },
        { min: 21, value: 1.0, label: "21 a 50" },
        { min: 51, value: 0.6, label: "51 a 99" },
        { min: 100, value: 0.4, label: "100 a 500" },
        { min: 501, value: 0.3, label: "501 a 1000" },
        { min: 1001, value: 0.25, label: "1001 a 5000" },
        { min: 5001, value: 0.2, label: "Acima de 5000" },
      ],
      laser: [
        { min: 1, value: 4.0, label: "1 a 5" },
        { min: 6, value: 3.5, label: "6 a 10" },
        { min: 11, value: 2.0, label: "11 a 50" },
        { min: 51, value: 1.9, label: "51 a 100" },
        { min: 101, value: 1.75, label: "101 a 300" },
        { min: 301, value: 1.5, label: "Acima de 300" },
      ],
    },
    coverPricing: {
      "Sulfite 75g": [
        { min: 1, value: 4.0, label: "1 a 5" },
        { min: 6, value: 3.5, label: "6 a 10" },
        { min: 11, value: 2.0, label: "11 a 50" },
        { min: 51, value: 1.9, label: "51 a 100" },
        { min: 101, value: 1.75, label: "101 a 300" },
        { min: 301, value: 1.5, label: "Acima de 300" },
      ],
      "Papel couche 170g": [
        { min: 1, value: 5.0, label: "1 a 5" },
        { min: 6, value: 4.0, label: "6 a 10" },
        { min: 11, value: 2.75, label: "11 a 50" },
        { min: 51, value: 2.4, label: "51 a 100" },
        { min: 101, value: 2.2, label: "101 a 300" },
        { min: 301, value: 2.0, label: "Acima de 300" },
      ],
      "Papel couche 250g": [
        { min: 1, value: 5.0, label: "1 a 5" },
        { min: 6, value: 4.0, label: "6 a 10" },
        { min: 11, value: 3.2, label: "11 a 50" },
        { min: 51, value: 2.85, label: "51 a 100" },
        { min: 101, value: 2.75, label: "101 a 300" },
        { min: 301, value: 2.45, label: "Acima de 300" },
      ],
      "Papel couche 300g": [
        { min: 1, value: 9.0, label: "1 a 5" },
        { min: 6, value: 8.0, label: "6 a 10" },
        { min: 11, value: 5.05, label: "11 a 50" },
        { min: 51, value: 4.9, label: "51 a 100" },
        { min: 101, value: 4.4, label: "101 a 300" },
        { min: 301, value: 4.4, label: "Acima de 300 (assumido)" },
      ],
    },
    spiralPricing: [
      { maxSheets: 50, rates: { "1": 4.5, "21": 3.8, "51": 3.7, "101": 3.3 } },
      { maxSheets: 100, rates: { "1": 5.0, "21": 4.3, "51": 4.2, "101": 3.8 } },
      { maxSheets: 200, rates: { "1": 8.2, "21": 6.3, "51": 5.9, "101": 5.7 } },
      { maxSheets: 300, rates: { "1": 18.0, "21": 18.0, "51": 18.0, "101": 18.0 } },
      { maxSheets: 500, rates: { "1": 30.0, "21": 30.0, "51": 30.0, "101": 30.0 } },
    ],
    bookletPricing: [
      { min: 1, value: 2.0, label: "Ate 10" },
      { min: 11, value: 1.5, label: "10 a 20" },
      { min: 21, value: 0.5, label: "Acima de 21" },
    ],
    colorPrintPricing: {
      "Sulfite 75g": [
        { min: 1, value: 4.0, label: "1 a 5" },
        { min: 6, value: 3.5, label: "6 a 10" },
        { min: 11, value: 2.0, label: "11 a 50" },
        { min: 51, value: 1.9, label: "51 a 100" },
        { min: 101, value: 1.75, label: "101 a 300" },
        { min: 301, value: 1.5, label: "Acima de 300" },
      ],
      "Offset 120g": [
        { min: 1, value: 5.0, label: "1 a 5" },
        { min: 6, value: 4.0, label: "6 a 10" },
        { min: 11, value: 2.45, label: "11 a 50" },
        { min: 51, value: 2.3, label: "51 a 100" },
        { min: 101, value: 2.2, label: "101 a 300" },
        { min: 301, value: 1.95, label: "Acima de 300" },
      ],
      "170g": [
        { min: 1, value: 5.0, label: "1 a 5" },
        { min: 6, value: 4.0, label: "6 a 10" },
        { min: 11, value: 2.75, label: "11 a 50" },
        { min: 51, value: 2.4, label: "51 a 100" },
        { min: 101, value: 2.2, label: "101 a 300" },
        { min: 301, value: 2.0, label: "Acima de 300" },
      ],
      "250g": [
        { min: 1, value: 5.0, label: "1 a 5" },
        { min: 6, value: 4.0, label: "6 a 10" },
        { min: 11, value: 3.2, label: "11 a 50" },
        { min: 51, value: 2.85, label: "51 a 100" },
        { min: 101, value: 2.75, label: "101 a 300" },
        { min: 301, value: 2.45, label: "Acima de 300" },
      ],
      "300g": [
        { min: 1, value: 9.0, label: "1 a 5" },
        { min: 6, value: 8.0, label: "6 a 10" },
        { min: 11, value: 5.05, label: "11 a 50" },
        { min: 51, value: 4.9, label: "51 a 100" },
        { min: 101, value: 4.4, label: "101 a 300" },
        { min: 301, value: 4.4, label: "Acima de 300 (assumido)" },
      ],
    },
    cutPricing: {
      upToFiveSheets: [
        { minUp: 1, value: 2.0, label: "Ate 11 por folha" },
        { minUp: 12, value: 2.5, label: "Acima de 11 por folha" },
        { minUp: 21, value: 3.0, label: "Acima de 20 por folha" },
        { minUp: 51, value: 10.0, label: "Acima de 50 por folha" },
      ],
      aboveFiveSheetsPerCut: 1.0,
    },
    spiralPlasticDiscount: 1.5,
  };
}

function createDefaultRow(index) {
  return {
    id: `row-${index + 1}`,
    description: "",
    printType: "Preto e branco",
    size: "A4",
    printMode: "So frente",
    finishing: "Sem acabamento",
    bindingGroup: "",
    quantity: 0,
    pages: 0,
    coverType: "Sem capa",
    coverPaper: "Sulfite 75g",
    backCoverType: "Sem contracapa",
    backCoverPaper: "Sulfite 75g",
    spiralOption: "Completa",
  };
}

function createDefaultColorPrintRow(index) {
  return {
    id: `color-row-${index + 1}`,
    description: "",
    widthMm: 0,
    heightMm: 0,
    bleedMode: "Sem sangra",
    printMode: "So frente",
    paperType: "Sulfite 75g",
    quantity: 0,
    cutPriceOverride: "",
  };
}

function createDefaultState() {
  return {
    calcMode: "Independente",
    presets: {
      printType: "Preto e branco",
      size: "A4",
      printMode: "So frente",
      finishing: "Sem acabamento",
      coverType: "Sem capa",
      coverPaper: "Sulfite 75g",
      backCoverType: "Sem contracapa",
      backCoverPaper: "Sulfite 75g",
      spiralOption: "Completa",
    },
    rows: Array.from({ length: 12 }, (_, index) => createDefaultRow(index)),
    colorPrintItems: Array.from({ length: 10 }, (_, index) => createDefaultColorPrintRow(index)),
    client: {
      name: "",
      contact: "",
      cnpj: "",
    },
    company: {
      name: "Copy Boy Copias e Servicos Ltda ME",
      cnpj: "04.516.832/0001-16",
      contact: "",
      address: "Rua Coronel Pedro Demoro, 1793 - Galeria Alecio - Estreito - Fpolis",
      logoDataUrl: "",
    },
    paymentTerms: "",
    quoteNotes: "",
  };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function mergeConfig(candidate) {
  const defaults = createDefaultConfig();
  if (!candidate || typeof candidate !== "object") {
    return defaults;
  }

  const merged = deepClone(defaults);
  if (candidate.printPricing) {
    merged.printPricing = {
      blackWhite: Array.isArray(candidate.printPricing.blackWhite) ? candidate.printPricing.blackWhite : merged.printPricing.blackWhite,
      inkjet: Array.isArray(candidate.printPricing.inkjet) ? candidate.printPricing.inkjet : merged.printPricing.inkjet,
      laser: Array.isArray(candidate.printPricing.laser) ? candidate.printPricing.laser : merged.printPricing.laser,
    };
  }

  if (candidate.coverPricing && typeof candidate.coverPricing === "object") {
    for (const paper of OPTIONS.coverPapers) {
      if (Array.isArray(candidate.coverPricing[paper])) {
        merged.coverPricing[paper] = candidate.coverPricing[paper];
      }
    }
  }

  if (Array.isArray(candidate.spiralPricing)) {
    merged.spiralPricing = candidate.spiralPricing;
  }

  if (Array.isArray(candidate.bookletPricing)) {
    merged.bookletPricing = candidate.bookletPricing;
  }

  if (candidate.colorPrintPricing && typeof candidate.colorPrintPricing === "object") {
    for (const key of Object.keys(merged.colorPrintPricing)) {
      if (Array.isArray(candidate.colorPrintPricing[key])) {
        merged.colorPrintPricing[key] = candidate.colorPrintPricing[key];
      }
    }
  }

  if (candidate.cutPricing && typeof candidate.cutPricing === "object") {
    if (Array.isArray(candidate.cutPricing.upToFiveSheets)) {
      merged.cutPricing.upToFiveSheets = candidate.cutPricing.upToFiveSheets;
    }
    if (Number.isFinite(Number(candidate.cutPricing.aboveFiveSheetsPerCut))) {
      merged.cutPricing.aboveFiveSheetsPerCut = Number(candidate.cutPricing.aboveFiveSheetsPerCut);
    }
  }

  if (Number.isFinite(Number(candidate.spiralPlasticDiscount))) {
    merged.spiralPlasticDiscount = Number(candidate.spiralPlasticDiscount);
  }

  return merged;
}

function mergeState(candidate) {
  const defaults = createDefaultState();
  if (!candidate || typeof candidate !== "object") {
    return defaults;
  }

  const state = deepClone(defaults);
  state.calcMode = OPTIONS.calcModes.includes(candidate.calcMode) ? candidate.calcMode : state.calcMode;
  state.presets = { ...state.presets, ...(candidate.presets || {}) };
  state.client = { ...state.client, ...(candidate.client || {}) };
  state.company = { ...state.company, ...(candidate.company || {}) };
  state.paymentTerms = typeof candidate.paymentTerms === "string" ? candidate.paymentTerms : state.paymentTerms;
  state.quoteNotes = typeof candidate.quoteNotes === "string" ? candidate.quoteNotes : state.quoteNotes;

  if (Array.isArray(candidate.rows) && candidate.rows.length > 0) {
    state.rows = candidate.rows.map((row, index) => ({
      ...createDefaultRow(index),
      ...row,
      quantity: toWholeNumber(row?.quantity),
      pages: toWholeNumber(row?.pages),
      id: row?.id || `row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.colorPrintItems) && candidate.colorPrintItems.length > 0) {
    state.colorPrintItems = candidate.colorPrintItems.map((row, index) => ({
      ...createDefaultColorPrintRow(index),
      ...row,
      widthMm: toDecimalNumber(row?.widthMm),
      heightMm: toDecimalNumber(row?.heightMm),
      quantity: toWholeNumber(row?.quantity),
      cutPriceOverride: row?.cutPriceOverride === "" || row?.cutPriceOverride === null || typeof row?.cutPriceOverride === "undefined"
        ? ""
        : toMoneyNumber(row?.cutPriceOverride),
      id: row?.id || `color-row-${index + 1}`,
    }));
  }

  return state;
}

function loadFromStorage(key, merger) {
  if (typeof localStorage === "undefined") {
    return merger(null);
  }

  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return merger(null);
    }
    return merger(JSON.parse(raw));
  } catch {
    return merger(null);
  }
}

function saveToStorage(key, value) {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

function toWholeNumber(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function toMoneyNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function toDecimalNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatInteger(value) {
  return new Intl.NumberFormat("pt-BR").format(Number(value || 0));
}

function formatMeasure(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function lookupTier(tiers, quantity, valueKey = "value") {
  const qty = Number(quantity || 0);
  if (!Array.isArray(tiers) || qty <= 0) {
    return 0;
  }

  let selected = tiers[0];
  for (const tier of tiers) {
    if (qty >= Number(tier.min || 0)) {
      selected = tier;
    }
  }

  return Number(selected?.[valueKey] || 0);
}

function getBlackWhiteTotal(rowImpressions, effectiveQuantity, config) {
  if (rowImpressions <= 0 || effectiveQuantity <= 0) {
    return 0;
  }

  const tiers = config.printPricing.blackWhite;
  const fixedOne = Number(tiers[0]?.value || 0);
  const fixedTwo = Number(tiers[1]?.value || 0);

  if (effectiveQuantity === 1) {
    return fixedOne * (rowImpressions / effectiveQuantity);
  }

  if (effectiveQuantity === 2) {
    return fixedTwo * (rowImpressions / effectiveQuantity);
  }

  return rowImpressions * lookupTier(tiers.slice(2), effectiveQuantity);
}

function getRegularPrintTotal(rowImpressions, effectiveQuantity, tiers) {
  if (rowImpressions <= 0 || effectiveQuantity <= 0) {
    return 0;
  }

  return rowImpressions * lookupTier(tiers, effectiveQuantity);
}

function getPrintTotalByType(printType, rowImpressions, effectiveQuantity, config) {
  if (printType === "Preto e branco") {
    return getBlackWhiteTotal(rowImpressions, effectiveQuantity, config);
  }

  if (printType === "Colorido jato de tinta") {
    return getRegularPrintTotal(rowImpressions, effectiveQuantity, config.printPricing.inkjet);
  }

  return getRegularPrintTotal(rowImpressions, effectiveQuantity, config.printPricing.laser);
}

function getCoverImpressions(row, kind) {
  const isCover = kind === "cover";
  const type = isCover ? row.coverType : row.backCoverType;
  const copies = Math.max(0, row.quantity);
  if ((isCover && type === "Sem capa") || (!isCover && type === "Sem contracapa") || copies <= 0) {
    return 0;
  }

  const sides = type === "Colorida frente e verso" ? 2 : 1;
  const baseCopies = row.size === "A5" && row.finishing !== "Livreto" ? Math.ceil(copies / 2) : copies;
  return baseCopies * sides;
}

function getBindingSheetsPerCopy(row) {
  const pages = Math.max(0, row.pages);
  if (pages <= 0) {
    return 0;
  }
  return row.printMode === "Frente e verso" ? Math.ceil(pages / 2) : pages;
}

function getInnerImpressions(row) {
  const copies = Math.max(0, row.quantity);
  const pages = Math.max(0, row.pages);
  if (copies <= 0 || pages <= 0) {
    return 0;
  }
  const pagesPerA4 = row.size === "A5" ? Math.ceil(pages / 2) : pages;
  return copies * pagesPerA4;
}

function getSpiralUnitPrice(row, bindingSheetsPerCopy, config) {
  if (bindingSheetsPerCopy <= 0 || bindingSheetsPerCopy > 500) {
    return 0;
  }

  const band = config.spiralPricing.find((item) => bindingSheetsPerCopy <= Number(item.maxSheets || 0));
  if (!band) {
    return 0;
  }

  const qty = Math.max(0, row.quantity);
  const rateKey = qty >= 101 ? "101" : qty >= 51 ? "51" : qty >= 21 ? "21" : "1";
  const unit = Number(band.rates?.[rateKey] || 0);
  const discount = row.spiralOption === "Sem capas plasticas" ? Number(config.spiralPlasticDiscount || 0) : 0;
  return Math.max(0, unit - discount);
}

function getBookletUnitPrice(quantity, config) {
  return lookupTier(config.bookletPricing, quantity);
}

function getColorPaperPricingKey(paperType) {
  if (paperType === "Sulfite 75g" || paperType === "Offset 120g") {
    return paperType;
  }
  if (["Couche 170g", "Offset 170g", "Reciclato 170g"].includes(paperType)) {
    return "170g";
  }
  if (["Couche 250g", "Offset 240g", "Reciclato 240g"].includes(paperType)) {
    return "250g";
  }
  return "300g";
}

function getBestFitOnA4(widthMm, heightMm) {
  const normalCols = Math.floor(A4_WIDTH_MM / widthMm);
  const normalRows = Math.floor(A4_HEIGHT_MM / heightMm);
  const normalTotal = normalCols * normalRows;

  const rotatedCols = Math.floor(A4_WIDTH_MM / heightMm);
  const rotatedRows = Math.floor(A4_HEIGHT_MM / widthMm);
  const rotatedTotal = rotatedCols * rotatedRows;

  if (rotatedTotal > normalTotal) {
    return { itemsPerSheet: rotatedTotal, cols: rotatedCols, rows: rotatedRows, rotated: true };
  }

  return { itemsPerSheet: normalTotal, cols: normalCols, rows: normalRows, rotated: false };
}

function estimateCuts(cols, rows) {
  return Math.max(0, cols - 1) + Math.max(0, rows - 1);
}

function lookupSmallJobCutValue(cutPricing, itemsPerSheet) {
  const tiers = cutPricing.upToFiveSheets || [];
  let selected = tiers[0];
  for (const tier of tiers) {
    if (itemsPerSheet >= Number(tier.minUp || 0)) {
      selected = tier;
    }
  }
  return Number(selected?.value || 0);
}

function normalizeBindingGroup(value) {
  return String(value ?? "").trim();
}

function isRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0 || Number(row.pages) > 0);
}

function isColorPrintRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0 || Number(row.widthMm) > 0 || Number(row.heightMm) > 0);
}

function calculateWorkbook(state, config) {
  const rows = state.rows.map((row) => ({
    ...row,
    quantity: toWholeNumber(row.quantity),
    pages: toWholeNumber(row.pages),
  }));

  const rowBase = rows.map((row) => {
    const innerImpressions = getInnerImpressions(row);
    const bindingSheetsPerCopy = getBindingSheetsPerCopy(row);
    const coverImpressions = getCoverImpressions(row, "cover");
    const backImpressions = getCoverImpressions(row, "back");
    return { row, innerImpressions, bindingSheetsPerCopy, coverImpressions, backImpressions };
  });

  const aggregateInnerByType = {};
  const aggregateCoverByPaper = {};

  for (const item of rowBase) {
    aggregateInnerByType[item.row.printType] = (aggregateInnerByType[item.row.printType] || 0) + item.innerImpressions;

    if (item.coverImpressions > 0) {
      aggregateCoverByPaper[item.row.coverPaper] = (aggregateCoverByPaper[item.row.coverPaper] || 0) + item.coverImpressions;
    }

    if (item.backImpressions > 0) {
      aggregateCoverByPaper[item.row.backCoverPaper] = (aggregateCoverByPaper[item.row.backCoverPaper] || 0) + item.backImpressions;
    }
  }

  const warnings = [];
  const groupMetaByIndex = {};
  const groupedRowsMap = {};

  rowBase.forEach((item, index) => {
    const groupName = normalizeBindingGroup(item.row.bindingGroup);
    if (!groupName || !isRowActive(item.row)) {
      return;
    }

    if (!groupedRowsMap[groupName]) {
      groupedRowsMap[groupName] = [];
    }

    groupedRowsMap[groupName].push({ ...item, index, groupName });
  });

  for (const [groupName, entries] of Object.entries(groupedRowsMap)) {
    const leader = entries[0];
    const finishingType = leader.row.finishing;
    const spiralOption = leader.row.spiralOption;
    const activeQuantities = entries.map((entry) => Math.max(0, entry.row.quantity)).filter((quantity) => quantity > 0);
    const quantitySet = [...new Set(activeQuantities)];
    const groupQuantity = activeQuantities.length > 0 ? Math.min(...activeQuantities) : 0;
    const sheetsPerCopy = entries.reduce((sum, entry) => sum + entry.bindingSheetsPerCopy, 0);
    const mixedFinishing = entries.some((entry) => entry.row.finishing !== finishingType);
    const mixedSpiral = entries.some((entry) => entry.row.spiralOption !== spiralOption);

    if (mixedFinishing) {
      warnings.push(`Grupo ${groupName}: existem tipos de acabamento diferentes. O app usou o acabamento da primeira linha do grupo.`);
    }

    if (mixedSpiral && finishingType === "Encadernacao espiral") {
      warnings.push(`Grupo ${groupName}: existem opcoes de espiral diferentes. O app usou a opcao da primeira linha do grupo.`);
    }

    if (quantitySet.length > 1) {
      warnings.push(`Grupo ${groupName}: as quantidades das linhas estao diferentes. O acabamento foi calculado usando a menor quantidade do grupo.`);
    }

    let finishingUnit = 0;
    let finishingTotal = 0;

    if (finishingType === "Encadernacao espiral") {
      finishingUnit = getSpiralUnitPrice({ ...leader.row, quantity: groupQuantity }, sheetsPerCopy, config);
      finishingTotal = groupQuantity * finishingUnit;
      if (sheetsPerCopy > 500) {
        warnings.push(`Grupo ${groupName}: a espiral vai ate 500 folhas por apostila. Ajuste esse grupo manualmente.`);
      }
    } else if (finishingType === "Livreto") {
      finishingUnit = getBookletUnitPrice(groupQuantity, config);
      finishingTotal = groupQuantity * finishingUnit;
    }

    entries.forEach((entry, entryIndex) => {
      groupMetaByIndex[entry.index] = {
        groupName,
        isLeader: entryIndex === 0,
        finishingType,
        groupQuantity,
        sheetsPerCopy,
        finishingUnit: entryIndex === 0 ? finishingUnit : 0,
        finishingTotal: entryIndex === 0 ? finishingTotal : 0,
      };
    });
  }

  const computedRows = rowBase.map((item, index) => {
    const { row, innerImpressions, bindingSheetsPerCopy, coverImpressions, backImpressions } = item;
    const effectiveInnerQty =
      state.calcMode === "Somar quantidades" ? aggregateInnerByType[row.printType] || 0 : innerImpressions;

    const samePaper = row.coverPaper === row.backCoverPaper;
    const coverPricingQty =
      state.calcMode === "Somar quantidades"
        ? aggregateCoverByPaper[row.coverPaper] || 0
        : samePaper
          ? coverImpressions + backImpressions
          : coverImpressions;
    const backPricingQty =
      state.calcMode === "Somar quantidades"
        ? aggregateCoverByPaper[row.backCoverPaper] || 0
        : samePaper
          ? coverImpressions + backImpressions
          : backImpressions;

    const innerTotal = getPrintTotalByType(row.printType, innerImpressions, effectiveInnerQty, config);
    const coverUnit = coverImpressions > 0 ? lookupTier(config.coverPricing[row.coverPaper], coverPricingQty) : 0;
    const backUnit = backImpressions > 0 ? lookupTier(config.coverPricing[row.backCoverPaper], backPricingQty) : 0;
    const coverTotal = coverImpressions * coverUnit;
    const backTotal = backImpressions * backUnit;

    let finishingUnit = 0;
    let finishingTotal = 0;
    const groupMeta = groupMetaByIndex[index];
    const hasGroupedFinishing = Boolean(groupMeta?.groupName);

    if (hasGroupedFinishing) {
      finishingUnit = groupMeta.finishingUnit;
      finishingTotal = groupMeta.finishingTotal;
    } else if (row.finishing === "Encadernacao espiral") {
      finishingUnit = getSpiralUnitPrice(row, bindingSheetsPerCopy, config);
      finishingTotal = row.quantity * finishingUnit;
      if (bindingSheetsPerCopy > 500 && isRowActive(row)) {
        warnings.push(`Item ${index + 1}: a espiral vai ate 500 folhas por apostila. Ajuste esse item manualmente.`);
      }
    } else if (row.finishing === "Livreto") {
      finishingUnit = getBookletUnitPrice(row.quantity, config);
      finishingTotal = row.quantity * finishingUnit;
    }

    const total = innerTotal + coverTotal + backTotal + finishingTotal;
    const unitValue = row.quantity > 0 ? total / row.quantity : 0;

    return {
      ...row,
      active: isRowActive(row),
      innerImpressions,
      bindingSheetsPerCopy,
      coverImpressions,
      backImpressions,
      innerTotal,
      coverTotal,
      backTotal,
      bindingGroup: normalizeBindingGroup(row.bindingGroup),
      bindingGroupLeader: Boolean(groupMeta?.isLeader),
      groupedFinishing: hasGroupedFinishing,
      groupedSheetsPerCopy: groupMeta?.sheetsPerCopy || 0,
      groupedQuantity: groupMeta?.groupQuantity || 0,
      finishingUnit,
      finishingTotal,
      total,
      unitValue,
    };
  });

  const activeRows = computedRows.filter((row) => row.active);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);
  const averageValue = totalQuantity > 0 ? totalGeneral / totalQuantity : 0;

  return {
    rows: computedRows,
    activeRows,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue,
    },
    warnings,
  };
}

function calculateColorPrintWorkbook(state, config) {
  const warnings = [];

  const computedRows = state.colorPrintItems.map((row, index) => {
    const widthMm = toDecimalNumber(row.widthMm);
    const heightMm = toDecimalNumber(row.heightMm);
    const quantity = toWholeNumber(row.quantity);
    const hasBleed = row.bleedMode === "Com sangra";
    const effectiveWidth = widthMm + (hasBleed ? 2 : 0);
    const effectiveHeight = heightMm + (hasBleed ? 2 : 0);
    const active = isColorPrintRowActive(row);

    if ((effectiveWidth > A4_WIDTH_MM && effectiveWidth > A4_HEIGHT_MM) || (effectiveHeight > A4_HEIGHT_MM && effectiveHeight > A4_WIDTH_MM)) {
      if (active) {
        warnings.push(`Impresso ${index + 1}: o tamanho informado nao cabe em uma folha A4.`);
      }
    }

    if (effectiveWidth <= 0 || effectiveHeight <= 0 || quantity <= 0) {
      return {
        ...row,
        widthMm,
        heightMm,
        effectiveWidth,
        effectiveHeight,
        active,
        itemsPerSheet: 0,
        a4Sheets: 0,
        a4Impressions: 0,
        printTotal: 0,
        suggestedCutPrice: 0,
        finalCutPrice: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        total: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        unitValue: 0,
        estimatedCuts: 0,
      };
    }

    const fit = getBestFitOnA4(effectiveWidth, effectiveHeight);
    if (fit.itemsPerSheet <= 0) {
      if (active) {
        warnings.push(`Impresso ${index + 1}: o tamanho informado nao cabe em uma folha A4.`);
      }
      return {
        ...row,
        widthMm,
        heightMm,
        effectiveWidth,
        effectiveHeight,
        active,
        itemsPerSheet: 0,
        a4Sheets: 0,
        a4Impressions: 0,
        printTotal: 0,
        suggestedCutPrice: 0,
        finalCutPrice: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        total: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        unitValue: 0,
        estimatedCuts: 0,
      };
    }

    const sides = row.printMode === "Frente e verso" ? 2 : 1;
    const a4Sheets = Math.ceil(quantity / fit.itemsPerSheet);
    const a4Impressions = a4Sheets * sides;
    const pricingKey = getColorPaperPricingKey(row.paperType);
    const printUnit = lookupTier(config.colorPrintPricing[pricingKey], a4Impressions);
    const printTotal = a4Impressions * printUnit;
    const estimatedCuts = estimateCuts(fit.cols, fit.rows);
    let suggestedCutPrice = 0;

    if (fit.itemsPerSheet > 1 && estimatedCuts > 0) {
      if (a4Sheets <= 5) {
        suggestedCutPrice = lookupSmallJobCutValue(config.cutPricing, fit.itemsPerSheet);
      } else {
        suggestedCutPrice = estimatedCuts * Number(config.cutPricing.aboveFiveSheetsPerCut || 0);
      }
    }

    const finalCutPrice = row.cutPriceOverride === "" ? suggestedCutPrice : toMoneyNumber(row.cutPriceOverride);
    const total = printTotal + finalCutPrice;
    const unitValue = quantity > 0 ? total / quantity : 0;

    return {
      ...row,
      widthMm,
      heightMm,
      effectiveWidth,
      effectiveHeight,
      active,
      itemsPerSheet: fit.itemsPerSheet,
      a4Sheets,
      a4Impressions,
      printTotal,
      suggestedCutPrice,
      finalCutPrice,
      total,
      unitValue,
      estimatedCuts,
    };
  });

  const activeRows = computedRows.filter((row) => row.active);
  const totalQuantity = activeRows.reduce((sum, row) => sum + toWholeNumber(row.quantity), 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);
  const averageValue = totalQuantity > 0 ? totalGeneral / totalQuantity : 0;

  return {
    rows: computedRows,
    activeRows,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue,
    },
    warnings,
  };
}

function buildOptions(options, currentValue) {
  return options
    .map((option) => `<option value="${escapeHtml(option)}"${option === currentValue ? " selected" : ""}>${escapeHtml(option)}</option>`)
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function countPdfPagesFromText(text) {
  const countMatches = [...text.matchAll(/\/Count\s+(\d+)/g)].map((match) => Number(match[1]));
  const validCounts = countMatches.filter((value) => Number.isFinite(value) && value > 0);
  if (validCounts.length > 0) {
    return Math.max(...validCounts);
  }

  const pageMatches = text.match(/\/Type\s*\/Page\b/g);
  return pageMatches ? pageMatches.length : 0;
}

async function countPdfPages(file) {
  const buffer = await file.arrayBuffer();
  const decoder = new TextDecoder("windows-1252");
  const text = decoder.decode(buffer);
  return countPdfPagesFromText(text);
}

function ensureRowCount(state, minimumCount) {
  while (state.rows.length < minimumCount) {
    state.rows.push(createDefaultRow(state.rows.length));
  }
}

function ensureColorRowCount(state, minimumCount) {
  while (state.colorPrintItems.length < minimumCount) {
    state.colorPrintItems.push(createDefaultColorPrintRow(state.colorPrintItems.length));
  }
}

function applyPresetToRow(row, preset) {
  row.printType = preset.printType;
  row.size = preset.size;
  row.printMode = preset.printMode;
  row.finishing = preset.finishing;
  row.coverType = preset.coverType;
  row.coverPaper = preset.coverPaper;
  row.backCoverType = preset.backCoverType;
  row.backCoverPaper = preset.backCoverPaper;
  row.spiralOption = preset.spiralOption;
}

function createConfigSectionsMarkup(config) {
  const cards = [];

  cards.push(
    createConfigCardMarkup(
      "Impressao preto e branco",
      "Nessa tabela os dois primeiros valores continuam como total fixo, igual na planilha.",
      createTableMarkup(
        ["Qtd minima", "Valor", "Modo"],
        config.printPricing.blackWhite,
        "bw",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "mode", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Colorido jato de tinta",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.printPricing.inkjet,
        "inkjet",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Colorido laser",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.printPricing.laser,
        "laser",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  for (const paper of OPTIONS.coverPapers) {
    cards.push(
      createConfigCardMarkup(
        `Capa e contracapa | ${paper}`,
        "",
        createTableMarkup(
          ["Qtd minima", "Valor", "Faixa"],
          config.coverPricing[paper],
          `cover-${paper}`,
          [
            { key: "min", type: "number", step: "1" },
            { key: "value", type: "number", step: "0.01" },
            { key: "label", type: "text" },
          ]
        )
      )
    );
  }

  cards.push(
    createConfigCardMarkup(
      "Encadernacao espiral",
      "Valores por unidade de apostila, conforme faixa de folhas e quantidade de exemplares.",
      createSpiralTableMarkup(config.spiralPricing)
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Livreto",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.bookletPricing,
        "booklet",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Impresso colorido | Sulfite 75g",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.colorPrintPricing["Sulfite 75g"],
        "color-Sulfite 75g",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Impresso colorido | Offset 120g",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.colorPrintPricing["Offset 120g"],
        "color-Offset 120g",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Impresso colorido | Couche 170 / Offset 170 / Reciclato 170",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.colorPrintPricing["170g"],
        "color-170g",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Impresso colorido | Couche 250 / Offset 240 / Reciclato 240",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.colorPrintPricing["250g"],
        "color-250g",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Impresso colorido | Couche 300 / Metalizados",
      "",
      createTableMarkup(
        ["Qtd minima", "Valor", "Faixa"],
        config.colorPrintPricing["300g"],
        "color-300g",
        [
          { key: "min", type: "number", step: "1" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )
    )
  );

  cards.push(
    createConfigCardMarkup(
      "Tabela de cortes | Impressos coloridos",
      "Ate 5 folhas usa valor fixo por faixa. Acima de 5 folhas usa valor por corte.",
      createColorCutTableMarkup(config.cutPricing)
    )
  );

  return cards.join("");
}

function createConfigCardMarkup(title, copy, innerMarkup) {
  return `
    <article class="config-card">
      <h3>${escapeHtml(title)}</h3>
      ${copy ? `<p class="helper-text">${escapeHtml(copy)}</p>` : ""}
      ${innerMarkup}
    </article>
  `;
}

function createTableMarkup(headers, rows, prefix, fields) {
  const head = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const body = rows
    .map((row, rowIndex) => {
      const cells = fields
        .map((field) => {
          const value = row[field.key] ?? "";
          return `
            <td>
              <input
                data-config-prefix="${escapeHtml(prefix)}"
                data-config-row="${rowIndex}"
                data-config-key="${escapeHtml(field.key)}"
                type="${field.type}"
                step="${field.step || "any"}"
                value="${escapeHtml(value)}"
              >
            </td>
          `;
        })
        .join("");
      return `<tr>${cells}</tr>`;
    })
    .join("");

  return `
    <div class="table-shell">
      <table class="config-table">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function createSpiralTableMarkup(rows) {
  const body = rows
    .map(
      (row, rowIndex) => `
        <tr>
          <td><input data-config-prefix="spiral" data-config-row="${rowIndex}" data-config-key="maxSheets" type="number" step="1" value="${escapeHtml(row.maxSheets)}"></td>
          <td><input data-config-prefix="spiral" data-config-row="${rowIndex}" data-config-key="rate-1" type="number" step="0.01" value="${escapeHtml(row.rates?.["1"])}"></td>
          <td><input data-config-prefix="spiral" data-config-row="${rowIndex}" data-config-key="rate-21" type="number" step="0.01" value="${escapeHtml(row.rates?.["21"])}"></td>
          <td><input data-config-prefix="spiral" data-config-row="${rowIndex}" data-config-key="rate-51" type="number" step="0.01" value="${escapeHtml(row.rates?.["51"])}"></td>
          <td><input data-config-prefix="spiral" data-config-row="${rowIndex}" data-config-key="rate-101" type="number" step="0.01" value="${escapeHtml(row.rates?.["101"])}"></td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="table-shell">
      <table class="config-table">
        <thead>
          <tr>
            <th>Folhas ate</th>
            <th>1</th>
            <th>21</th>
            <th>51</th>
            <th>101</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
  `;
}

function createColorCutTableMarkup(cutPricing) {
  const body = (cutPricing.upToFiveSheets || [])
    .map(
      (row, rowIndex) => `
        <tr>
          <td><input data-config-prefix="cut-up5" data-config-row="${rowIndex}" data-config-key="minUp" type="number" step="1" value="${escapeHtml(row.minUp)}"></td>
          <td><input data-config-prefix="cut-up5" data-config-row="${rowIndex}" data-config-key="value" type="number" step="0.01" value="${escapeHtml(row.value)}"></td>
          <td><input data-config-prefix="cut-up5" data-config-row="${rowIndex}" data-config-key="label" type="text" value="${escapeHtml(row.label)}"></td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="table-shell">
      <table class="config-table">
        <thead>
          <tr>
            <th>Minimo por folha</th>
            <th>Valor</th>
            <th>Faixa</th>
          </tr>
        </thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    <div class="config-grid">
      <label>
        <span>Acima de 5 folhas | valor por corte</span>
        <input data-config-prefix="cut-above5" data-config-row="0" data-config-key="aboveFiveSheetsPerCut" type="number" step="0.01" value="${escapeHtml(cutPricing.aboveFiveSheetsPerCut)}">
      </label>
    </div>
  `;
}

function getConfigArrayByPrefix(config, prefix) {
  if (prefix === "bw") return config.printPricing.blackWhite;
  if (prefix === "inkjet") return config.printPricing.inkjet;
  if (prefix === "laser") return config.printPricing.laser;
  if (prefix === "booklet") return config.bookletPricing;
  if (prefix === "spiral") return config.spiralPricing;
  if (prefix === "cut-up5") return config.cutPricing.upToFiveSheets;
  if (prefix === "cut-above5") return config.cutPricing;
  if (prefix.startsWith("color-")) return config.colorPrintPricing[prefix.slice(6)];
  if (prefix.startsWith("cover-")) {
    return config.coverPricing[prefix.slice(6)];
  }
  return null;
}

function createQuoteHtml(state, workbook, colorWorkbook) {
  const dateText = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const quoteEntries = [
    ...workbook.activeRows.map((row) => ({
      kind: "Apostila",
      description: row.description,
      detail: `${formatInteger(row.quantity)} apostilas | ${formatInteger(row.pages)} paginas | ${row.printType} | ${row.finishing}${row.bindingGroup ? ` | Grupo ${row.bindingGroup}` : ""}`,
      total: row.total,
    })),
    ...colorWorkbook.activeRows.map((row) => ({
      kind: "Impresso colorido",
      description: row.description,
      detail: `${formatInteger(row.quantity)} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} mm | ${row.paperType} | ${row.printMode}`,
      total: row.total,
    })),
  ];
  const combinedTotal = workbook.totals.totalGeneral + colorWorkbook.totals.totalGeneral;
  const combinedUnits = workbook.totals.totalQuantity + colorWorkbook.totals.totalQuantity;
  const lineItemsMarkup = quoteEntries.length
    ? quoteEntries
        .map(
          (entry, index) => `
            <div class="quote-line">
              <div>
                <strong>${escapeHtml(entry.description || `Item ${index + 1}`)}</strong>
                <small>
                  ${escapeHtml(entry.kind)} | ${escapeHtml(entry.detail)}
                </small>
              </div>
              <div>${formatCurrency(entry.total)}</div>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state">Adicione pelo menos uma apostila no calculo para montar o resumo do orcamento.</div>`;

  const notesMarkup = state.quoteNotes?.trim()
    ? `<div class="quote-box"><h3>Observacoes</h3><p class="quote-muted">${escapeHtml(state.quoteNotes).replaceAll("\n", "<br>")}</p></div>`
    : "";

  const logoMarkup = state.company.logoDataUrl
    ? `<div class="logo-box"><img src="${state.company.logoDataUrl}" alt="Logo da empresa"></div>`
    : document.getElementById("logo-placeholder-template").innerHTML;

  return `
    <div class="quote-sheet">
      <div class="quote-header">
        ${logoMarkup}
        <div class="quote-company-block">
          <p class="eyebrow">Orcamento</p>
          <h2 class="quote-company-name">${escapeHtml(state.company.name || "Sua empresa")}</h2>
          <p class="quote-muted">Data: ${escapeHtml(dateText)}</p>
          <p class="quote-muted">CNPJ: ${escapeHtml(state.company.cnpj || "-")}</p>
          <p class="quote-muted">${escapeHtml(state.company.address || "-")}</p>
          <p class="quote-muted">${escapeHtml(state.company.contact || "")}</p>
        </div>
      </div>

      <div class="quote-meta-grid">
        <div class="quote-box">
          <h3>Cliente</h3>
          <p class="quote-muted">Nome / Razao social: ${escapeHtml(state.client.name || "-")}</p>
          <p class="quote-muted">Contato: ${escapeHtml(state.client.contact || "-")}</p>
          <p class="quote-muted">CNPJ: ${escapeHtml(state.client.cnpj || "-")}</p>
        </div>
        <div class="quote-box">
          <h3>Pagamento</h3>
          <p class="quote-muted">${escapeHtml(state.paymentTerms || "-")}</p>
        </div>
      </div>

      <div class="quote-box">
        <h3>Itens do orcamento</h3>
        <div class="quote-lines">${lineItemsMarkup}</div>
      </div>

      ${notesMarkup}

      <div class="quote-total-bar">
        <div>
          <strong>Total geral</strong>
          <p class="quote-muted">Total de unidades: ${formatInteger(combinedUnits)}</p>
        </div>
        <strong>${formatCurrency(combinedTotal)}</strong>
      </div>
    </div>
  `;
}

function createQuoteText(state, workbook, colorWorkbook) {
  const dateText = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const lines = [
    `ORCAMENTO | ${state.company.name || "Sua empresa"}`,
    `Data: ${dateText}`,
    `CNPJ: ${state.company.cnpj || "-"}`,
    `Endereco: ${state.company.address || "-"}`,
    "",
    `Cliente: ${state.client.name || "-"}`,
    `Contato: ${state.client.contact || "-"}`,
    `CNPJ cliente: ${state.client.cnpj || "-"}`,
    `Pagamento: ${state.paymentTerms || "-"}`,
    "",
    "Itens:",
  ];

  const quoteEntries = [
    ...workbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Apostila ${index + 1}`} | ${row.quantity} apostilas | ${row.pages} paginas | ${row.printType} | ${row.finishing}${row.bindingGroup ? ` | Grupo ${row.bindingGroup}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...colorWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Impresso ${index + 1}`} | ${row.quantity} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} mm | ${row.paperType} | ${row.printMode} | ${formatCurrency(row.total)}`,
    })),
  ];

  if (quoteEntries.length === 0) {
    lines.push("- Nenhum item preenchido.");
  } else {
    quoteEntries.forEach((entry) => lines.push(entry.text));
  }

  lines.push("", `Total geral: ${formatCurrency(workbook.totals.totalGeneral + colorWorkbook.totals.totalGeneral)}`);

  if (state.quoteNotes?.trim()) {
    lines.push("", "Observacoes:", state.quoteNotes.trim());
  }

  return lines.join("\n");
}

function initApp() {
  const state = loadFromStorage(STORAGE_KEYS.state, mergeState);
  const config = loadFromStorage(STORAGE_KEYS.config, mergeConfig);
  const selectedRowIds = new Set();
  ensureRowCount(state, 12);
  ensureColorRowCount(state, 10);

  const rowsTableBody = document.getElementById("rows-table-body");
  const colorRowsTableBody = document.getElementById("color-rows-table-body");
  const warningList = document.getElementById("warning-list");
  const colorWarningList = document.getElementById("color-warning-list");
  const configSections = document.getElementById("config-sections");
  const quotePreview = document.getElementById("quote-preview");
  const feedback = document.getElementById("import-feedback");
  const colorFeedback = document.getElementById("color-feedback");

  const tabButtons = [...document.querySelectorAll(".tab-button")];
  const tabPanels = [...document.querySelectorAll(".tab-panel")];

  function selectTab(tabName) {
    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tabTarget === tabName);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
    });
  }

  function persist() {
    saveToStorage(STORAGE_KEYS.state, state);
    saveToStorage(STORAGE_KEYS.config, config);
  }

  function renderPresetControls() {
    document.getElementById("calc-mode-select").value = state.calcMode;
    document.getElementById("preset-print-type").innerHTML = buildOptions(OPTIONS.printTypes, state.presets.printType);
    document.getElementById("preset-size").innerHTML = buildOptions(OPTIONS.sizes, state.presets.size);
    document.getElementById("preset-print-mode").innerHTML = buildOptions(OPTIONS.printModes, state.presets.printMode);
    document.getElementById("preset-finishing").innerHTML = buildOptions(OPTIONS.finishing, state.presets.finishing);
    document.getElementById("preset-cover").innerHTML = buildOptions(OPTIONS.coverTypes, state.presets.coverType);
    document.getElementById("preset-cover-paper").innerHTML = buildOptions(OPTIONS.coverPapers, state.presets.coverPaper);
    document.getElementById("preset-back-cover").innerHTML = buildOptions(OPTIONS.backCoverTypes, state.presets.backCoverType);
    document.getElementById("preset-back-cover-paper").innerHTML = buildOptions(OPTIONS.coverPapers, state.presets.backCoverPaper);
    document.getElementById("preset-spiral-option").innerHTML = buildOptions(OPTIONS.spiralOptions, state.presets.spiralOption);
  }

  function renderClientFields() {
    document.getElementById("client-name").value = state.client.name;
    document.getElementById("client-contact").value = state.client.contact;
    document.getElementById("client-cnpj").value = state.client.cnpj;
    document.getElementById("payment-terms").value = state.paymentTerms;
    document.getElementById("quote-notes").value = state.quoteNotes;
    document.getElementById("company-name").value = state.company.name;
    document.getElementById("company-cnpj").value = state.company.cnpj;
    document.getElementById("company-contact").value = state.company.contact;
    document.getElementById("company-address").value = state.company.address;
  }

  function renderConfig() {
    configSections.innerHTML = createConfigSectionsMarkup(config);
    document.getElementById("spiral-discount-input").value = config.spiralPlasticDiscount;
  }

  function renderRowsAndSummary() {
    const workbook = calculateWorkbook(state, config);
    const colorWorkbook = calculateColorPrintWorkbook(state, config);

    document.getElementById("summary-active-lines").textContent = formatInteger(workbook.totals.activeLines);
    document.getElementById("summary-booklets").textContent = formatInteger(workbook.totals.totalQuantity);
    document.getElementById("summary-total").textContent = formatCurrency(workbook.totals.totalGeneral);
    document.getElementById("summary-average").textContent = formatCurrency(workbook.totals.averageValue);

    document.getElementById("color-summary-active").textContent = formatInteger(colorWorkbook.totals.activeLines);
    document.getElementById("color-summary-quantity").textContent = formatInteger(colorWorkbook.totals.totalQuantity);
    document.getElementById("color-summary-total").textContent = formatCurrency(colorWorkbook.totals.totalGeneral);
    document.getElementById("color-summary-average").textContent = formatCurrency(colorWorkbook.totals.averageValue);

    rowsTableBody.innerHTML = workbook.rows
      .map((row, index) => {
        const rowClass = row.active ? "" : "is-empty";
        return `
          <tr class="${rowClass}" data-row-index="${index}">
            <td><input type="checkbox" class="row-selector" data-row-id="${escapeHtml(row.id)}"${selectedRowIds.has(row.id) ? " checked" : ""}></td>
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}"></td>
            <td><select class="cell-select" name="printType">${buildOptions(OPTIONS.printTypes, row.printType)}</select></td>
            <td><select class="cell-select" name="size">${buildOptions(OPTIONS.sizes, row.size)}</select></td>
            <td><select class="cell-select" name="printMode">${buildOptions(OPTIONS.printModes, row.printMode)}</select></td>
            <td><select class="cell-select" name="finishing">${buildOptions(OPTIONS.finishing, row.finishing)}</select></td>
            <td><input class="cell-input" name="bindingGroup" value="${escapeHtml(row.bindingGroup)}" placeholder="Ex.: Grupo A"></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}"></td>
            <td><input class="cell-input" name="pages" type="number" min="0" step="1" value="${escapeHtml(row.pages)}"></td>
            <td><select class="cell-select" name="coverType">${buildOptions(OPTIONS.coverTypes, row.coverType)}</select></td>
            <td><select class="cell-select" name="coverPaper">${buildOptions(OPTIONS.coverPapers, row.coverPaper)}</select></td>
            <td><select class="cell-select" name="backCoverType">${buildOptions(OPTIONS.backCoverTypes, row.backCoverType)}</select></td>
            <td><select class="cell-select" name="backCoverPaper">${buildOptions(OPTIONS.coverPapers, row.backCoverPaper)}</select></td>
            <td><select class="cell-select" name="spiralOption">${buildOptions(OPTIONS.spiralOptions, row.spiralOption)}</select></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.innerTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.coverTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.backTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.finishingTotal)}${row.groupedFinishing ? `<br><small>${row.bindingGroupLeader ? `Grupo ${escapeHtml(row.bindingGroup)}` : `Grupo ${escapeHtml(row.bindingGroup)} (na 1a linha)`}</small>` : ""}</span></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `;
      })
      .join("");

    colorRowsTableBody.innerHTML = colorWorkbook.rows
      .map(
        (row, index) => `
          <tr class="${row.active ? "" : "is-empty"}" data-color-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}"></td>
            <td><input class="cell-input" name="widthMm" type="number" min="0" step="0.1" value="${escapeHtml(row.widthMm)}"></td>
            <td><input class="cell-input" name="heightMm" type="number" min="0" step="0.1" value="${escapeHtml(row.heightMm)}"></td>
            <td><select class="cell-select" name="bleedMode">${buildOptions(OPTIONS.bleedModes, row.bleedMode)}</select></td>
            <td><select class="cell-select" name="printMode">${buildOptions(OPTIONS.printModes, row.printMode)}</select></td>
            <td><select class="cell-select" name="paperType">${buildOptions(OPTIONS.colorPaperTypes, row.paperType)}</select></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}"></td>
            <td><span class="readonly-value subtle">${formatInteger(row.itemsPerSheet)}</span></td>
            <td><span class="readonly-value subtle">${formatInteger(row.a4Sheets)}</span></td>
            <td><span class="readonly-value subtle">${formatInteger(row.a4Impressions)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.printTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.suggestedCutPrice)}</span></td>
            <td><input class="cell-input" name="cutPriceOverride" type="number" min="0" step="0.01" value="${escapeHtml(row.cutPriceOverride)}" placeholder="${row.suggestedCutPrice > 0 ? row.suggestedCutPrice.toFixed(2) : "0.00"}"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `
      )
      .join("");

    warningList.innerHTML = workbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("");
    colorWarningList.innerHTML = colorWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("");
    quotePreview.innerHTML = createQuoteHtml(state, workbook, colorWorkbook);
    return { workbook, colorWorkbook };
  }

  function renderAll() {
    renderPresetControls();
    renderClientFields();
    renderConfig();
    return renderRowsAndSummary();
  }

  function updatePreset(name, value) {
    state.presets[name] = value;
    persist();
  }

  function applyPreset(scope) {
    state.rows.forEach((row) => {
      if (scope === "active" && !isRowActive(row)) {
        return;
      }
      applyPresetToRow(row, state.presets);
    });
    persist();
    renderRowsAndSummary();
  }

  async function importPdfFiles(fileList) {
    const files = [...fileList].filter((file) => file.name.toLowerCase().endsWith(".pdf"));
    if (files.length === 0) {
      feedback.textContent = "Nenhum PDF valido foi selecionado.";
      return;
    }

    const firstFreeIndex = state.rows.findIndex((row) => !isRowActive(row));
    const startIndex = firstFreeIndex === -1 ? state.rows.length : firstFreeIndex;
    ensureRowCount(state, startIndex + files.length);

    let imported = 0;
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      const pages = await countPdfPages(file);
      const row = state.rows[startIndex + index];
      applyPresetToRow(row, state.presets);
      row.description = file.name.replace(/\.pdf$/i, "");
      row.quantity = 1;
      row.pages = pages || 0;
      imported += 1;
    }

    persist();
    renderRowsAndSummary();
    feedback.textContent = `${imported} PDF(s) importado(s). Se alguma contagem de paginas vier diferente, basta corrigir direto na linha.`;
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectTab(button.dataset.tabTarget);
    });
  });

  document.getElementById("import-button").addEventListener("click", () => {
    document.getElementById("pdf-input").click();
  });

  document.getElementById("pdf-input").addEventListener("change", async (event) => {
    if (event.target.files?.length) {
      await importPdfFiles(event.target.files);
      event.target.value = "";
    }
  });

  document.getElementById("add-row-button").addEventListener("click", () => {
    state.rows.push(createDefaultRow(state.rows.length));
    persist();
    renderRowsAndSummary();
  });

  document.getElementById("add-color-row-button").addEventListener("click", () => {
    state.colorPrintItems.push(createDefaultColorPrintRow(state.colorPrintItems.length));
    persist();
    renderRowsAndSummary();
  });

  document.getElementById("clear-all-button").addEventListener("click", () => {
    selectedRowIds.clear();
    state.rows = Array.from({ length: 12 }, (_, index) => createDefaultRow(index));
    persist();
    renderRowsAndSummary();
    feedback.textContent = "As linhas foram limpas.";
  });

  document.getElementById("clear-color-rows-button").addEventListener("click", () => {
    state.colorPrintItems = Array.from({ length: 10 }, (_, index) => createDefaultColorPrintRow(index));
    persist();
    renderRowsAndSummary();
    colorFeedback.textContent = "As linhas de impressos coloridos foram limpas.";
  });

  document.getElementById("calc-mode-select").addEventListener("change", (event) => {
    state.calcMode = event.target.value;
    persist();
    renderRowsAndSummary();
  });

  [
    ["preset-print-type", "printType"],
    ["preset-size", "size"],
    ["preset-print-mode", "printMode"],
    ["preset-finishing", "finishing"],
    ["preset-cover", "coverType"],
    ["preset-cover-paper", "coverPaper"],
    ["preset-back-cover", "backCoverType"],
    ["preset-back-cover-paper", "backCoverPaper"],
    ["preset-spiral-option", "spiralOption"],
  ].forEach(([elementId, key]) => {
    document.getElementById(elementId).addEventListener("change", (event) => {
      updatePreset(key, event.target.value);
    });
  });

  document.getElementById("apply-preset-active").addEventListener("click", () => {
    applyPreset("active");
  });

  document.getElementById("apply-preset-all").addEventListener("click", () => {
    applyPreset("all");
  });

  rowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    if (target.classList.contains("row-selector")) {
      const rowId = target.dataset.rowId;
      if (!rowId) {
        return;
      }
      if (target.checked) {
        selectedRowIds.add(rowId);
      } else {
        selectedRowIds.delete(rowId);
      }
      return;
    }

    const rowElement = target.closest("tr[data-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.rows[Number(rowElement.dataset.rowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }
    row[field] = field === "quantity" || field === "pages" ? toWholeNumber(target.value) : target.value;
    persist();
    renderRowsAndSummary();
  });

  colorRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-color-row-index]");
    if (!rowElement) {
      return;
    }

    const row = state.colorPrintItems[Number(rowElement.dataset.colorRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }

    if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "widthMm" || field === "heightMm") {
      row[field] = toDecimalNumber(target.value);
    } else if (field === "cutPriceOverride") {
      row[field] = target.value === "" ? "" : toMoneyNumber(target.value);
    } else {
      row[field] = target.value;
    }

    persist();
    renderRowsAndSummary();
  });

  document.getElementById("apply-group-selected").addEventListener("click", () => {
    const groupName = normalizeBindingGroup(document.getElementById("group-name-input").value);
    if (!groupName) {
      feedback.textContent = "Digite um nome de grupo antes de aplicar nas linhas selecionadas.";
      return;
    }

    let changed = 0;
    state.rows.forEach((row) => {
      if (selectedRowIds.has(row.id)) {
        row.bindingGroup = groupName;
        changed += 1;
      }
    });

    persist();
    renderRowsAndSummary();
    feedback.textContent = changed > 0 ? `Grupo ${groupName} aplicado em ${changed} linha(s).` : "Nenhuma linha foi selecionada.";
  });

  document.getElementById("clear-group-selected").addEventListener("click", () => {
    let changed = 0;
    state.rows.forEach((row) => {
      if (selectedRowIds.has(row.id)) {
        row.bindingGroup = "";
        changed += 1;
      }
    });

    persist();
    renderRowsAndSummary();
    feedback.textContent = changed > 0 ? `Grupo removido de ${changed} linha(s).` : "Nenhuma linha foi selecionada.";
  });

  document.getElementById("spiral-discount-input").addEventListener("input", (event) => {
    config.spiralPlasticDiscount = toMoneyNumber(event.target.value);
    persist();
    renderRowsAndSummary();
  });

  configSections.addEventListener("input", (event) => {
    const target = event.target;
    const prefix = target.dataset.configPrefix;
    const rowIndex = Number(target.dataset.configRow);
    const key = target.dataset.configKey;
    if (!prefix || !key) {
      return;
    }

    const array = getConfigArrayByPrefix(config, prefix);
    if (!array || !array[rowIndex]) {
      return;
    }

    if (prefix === "spiral" && key.startsWith("rate-")) {
      const rateKey = key.replace("rate-", "");
      array[rowIndex].rates[rateKey] = toMoneyNumber(target.value);
    } else if (prefix === "cut-above5") {
      array[key] = toMoneyNumber(target.value);
    } else if (key === "min" || key === "maxSheets") {
      array[rowIndex][key] = toWholeNumber(target.value);
    } else if (key === "minUp") {
      array[rowIndex][key] = toWholeNumber(target.value);
    } else if (key === "value") {
      array[rowIndex][key] = toMoneyNumber(target.value);
    } else {
      array[rowIndex][key] = target.value;
    }

    persist();
    renderRowsAndSummary();
  });

  document.getElementById("reset-config-button").addEventListener("click", () => {
    const reset = createDefaultConfig();
    Object.assign(config, reset);
    persist();
    renderAll();
  });

  document.getElementById("export-config-button").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "configuracao-apostilas-copy-boy.json";
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("import-config-button").addEventListener("click", () => {
    document.getElementById("config-file-input").click();
  });

  document.getElementById("config-file-input").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const imported = mergeConfig(JSON.parse(text));
      Object.assign(config, imported);
      persist();
      renderAll();
      feedback.textContent = "Configuracao importada com sucesso.";
    } catch {
      feedback.textContent = "Nao consegui ler esse arquivo de configuracao.";
    }

    event.target.value = "";
  });

  [
    ["client-name", "client", "name"],
    ["client-contact", "client", "contact"],
    ["client-cnpj", "client", "cnpj"],
    ["payment-terms", null, "paymentTerms"],
    ["quote-notes", null, "quoteNotes"],
    ["company-name", "company", "name"],
    ["company-cnpj", "company", "cnpj"],
    ["company-contact", "company", "contact"],
    ["company-address", "company", "address"],
  ].forEach(([elementId, section, field]) => {
    document.getElementById(elementId).addEventListener("input", (event) => {
      if (section) {
        state[section][field] = event.target.value;
      } else {
        state[field] = event.target.value;
      }
      persist();
      renderRowsAndSummary();
    });
  });

  document.getElementById("company-logo-input").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      state.company.logoDataUrl = typeof reader.result === "string" ? reader.result : "";
      persist();
      renderRowsAndSummary();
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("copy-quote-button").addEventListener("click", async () => {
    const workbook = calculateWorkbook(state, config);
    const colorWorkbook = calculateColorPrintWorkbook(state, config);
    const text = createQuoteText(state, workbook, colorWorkbook);
    try {
      await navigator.clipboard.writeText(text);
      feedback.textContent = "Resumo do orcamento copiado.";
    } catch {
      feedback.textContent = "Nao consegui copiar automaticamente, mas a previa continua disponivel na tela.";
    }
  });

  document.getElementById("print-quote-button").addEventListener("click", () => {
    selectTab("orcamento");
    window.print();
  });

  const dropzone = document.getElementById("pdf-dropzone");
  ["dragenter", "dragover"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  });

  ["dragleave", "drop"].forEach((eventName) => {
    dropzone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  });

  dropzone.addEventListener("drop", async (event) => {
    const files = event.dataTransfer?.files;
    if (files?.length) {
      await importPdfFiles(files);
    }
  });

  renderAll();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  initApp();
}
