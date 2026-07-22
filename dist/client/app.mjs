const STORAGE_KEYS = {
  state: "copyboy-apostilas-state-v1",
  config: "copyboy-apostilas-config-v1",
  configView: "copyboy-apostilas-config-view-v1",
  configSection: "copyboy-apostilas-config-section-v1",
};

const SESSION_KEYS = {
  configUnlocked: "graficalc-config-unlocked-v1",
};

const CONFIG_ACCESS_PASSWORD = "copyboy2026";
const SHARED_API_PATH = "/api/shared-state";
const SHARED_SYNC_INTERVAL_MS = 20000;

const OPTIONS = {
  printTypes: ["Preto e branco", "Colorido jato de tinta", "Colorido laser"],
  sizes: ["A4", "A5"],
  printModes: ["Só frente", "Frente e verso"],
  bleedModes: ["Sem sangra", "Com sangra"],
  finishing: ["Sem acabamento", "Encadernação espiral", "Livreto"],
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
  credentialMaterials: [
    "Couche 250g",
    "Couche 300g",
    "Offset 240g",
    "PS 1mm",
    "PS 2mm",
  ],
  credentialLamination: ["Sem laminação", "Com laminação"],
  readyProducts: [
    "Cordão de crachá liso",
    "Cordão estampado 20mm com jacaré",
    "Cordão estampado 20mm com mosquetão",
  ],
  businessCardProductions: ["Laser", "Offset"],
  businessCardPrintModes: ["Só frente", "Frente e verso"],
  businessCardExtraFinish: ["Sem acabamento adicional", "Com acabamento adicional"],
  flyerProductions: ["Laser", "Offset"],
  flyerPrintModes: ["Só frente", "Frente e verso"],
  flyerFolds: ["Sem dobra", "1 dobra", "2 dobras"],
  spiralOptions: ["Completa", "Sem capas plásticas"],
  calcModes: ["Independente", "Somar quantidades"],
  m2CalcModes: ["Independente", "Somar materiais iguais"],
};

const M2_PRODUCTS = [
  {
    id: "adesivo-corte-especial",
    label: "Adesivo com corte especial",
    material: "Adesivo vinil branco",
    print: "Ecossolvente 4x0",
    finishing: "Corte especial",
    tiers: [
      { maxArea: 2, value: 90 },
      { maxArea: 4, value: 85 },
      { maxArea: 6, value: 75 },
      { maxArea: 10, value: 65 },
    ],
  },
  {
    id: "lona-bainha-ilhos",
    label: "Lona com bainha e ilhós",
    material: "Lona vinílica",
    print: "Ecossolvente 4x0",
    finishing: "Bainha e ilhós",
    tiers: [
      { maxArea: 2, value: 70 },
      { maxArea: 4, value: 65 },
      { maxArea: 6, value: 63 },
      { maxArea: 10, value: 60 },
      { maxArea: Infinity, value: 58 },
    ],
  },
  {
    id: "banner",
    label: "Banner",
    material: "Lona vinílica",
    print: "Ecossolvente 4x0",
    finishing: "Bastão de madeira e cordão",
    tiers: [
      { maxArea: 2, value: 70 },
      { maxArea: 4, value: 65 },
      { maxArea: 6, value: 63 },
      { maxArea: 10, value: 60 },
      { maxArea: Infinity, value: 58 },
    ],
  },
  {
    id: "adesivo-uv",
    label: "Rótulo UV",
    material: "Adesivo vinil branco",
    print: "UV 4x0",
    finishing: "Corte reto",
    tiers: [
      { maxArea: 2, value: 125 },
      { maxArea: 4, value: 115 },
      { maxArea: 6, value: 105 },
      { maxArea: 10, value: 100 },
      { maxArea: Infinity, value: 100 },
    ],
  },
  {
    id: "adesivo-uv-verniz",
    label: "Rótulo UV com branco/verniz",
    material: "BOPP branco",
    print: "UV 4x0 + branco/verniz",
    finishing: "Corte reto",
    tiers: [
      { maxArea: 2, value: 155 },
      { maxArea: 4, value: 145 },
      { maxArea: 6, value: 135 },
      { maxArea: 10, value: 128 },
      { maxArea: Infinity, value: 120 },
    ],
  },
  {
    id: "ps-2mm",
    label: "PS 2mm",
    material: "PS 2mm",
    print: "UV 4x0",
    finishing: "Laminação",
    tiers: [
      { maxArea: 1, value: 180 },
      { maxArea: 2, value: 174 },
      { maxArea: 4, value: 168 },
      { maxArea: 10, value: 162 },
      { maxArea: Infinity, value: 158 },
    ],
  },
  {
    id: "ps-1mm",
    label: "PS 1mm",
    material: "PS 1mm",
    print: "UV 4x0",
    finishing: "Laminação",
    tiers: [
      { maxArea: 1, value: 156 },
      { maxArea: 2, value: 144 },
      { maxArea: 4, value: 132 },
      { maxArea: 10, value: 126 },
      { maxArea: Infinity, value: 124 },
    ],
  },
];

const M2_CATALOG = [
  { id: "digital-cut", label: "Adesivo impressão digital com corte especial", configKey: "digitalCut", bleedMm: 2 },
  { id: "uv-cut", label: "Adesivo impressão UV com corte especial", configKey: "uvCut", bleedMm: 2 },
  { id: "uv-verniz", label: "Adesivo impressão UV com verniz ou tinta branca", configKey: "uvVerniz", bleedMm: 2 },
  { id: "flat-cut", label: "Adesivo corte reto/sem acabamento", configKey: "flatCut" },
  { id: "banner", label: "Banner", configKey: "banner" },
  { id: "perfurado", label: "Adesivo perfurado", configKey: "perfurado" },
  { id: "ps1mm", label: "Chapa PS1mm", configKey: "ps1mm" },
  { id: "ps2mm", label: "Chapa PS 2mm", configKey: "ps2mm" },
];

const DEFAULT_M2_DESCRIPTIONS = {
  "digital-cut": "Adesivo vinil com impressão digital",
  "flat-cut": "Adesivo vinil com impressão digital",
  perfurado: "Adesivo perfurado com impressão digital",
  "uv-cut": "Adesivo vinil com impressão UV",
  "uv-verniz": "Adesivo vinil com impressão UV",
  ps1mm: "Chapa de PS 1mm com impressão UV direto na chapa",
  ps2mm: "Chapa de PS 2mm com impressão UV direto na chapa",
};

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A3_WIDTH_MM = 420;
const A3_HEIGHT_MM = 297;
const RESIN_MARGIN_MM = 3;

const RESIN_MATERIAL_LABELS = {
  white: "Adesivo branco",
  transparent: "Adesivo transparente",
  "holo-gold": "Adesivo holográfico dourado",
  "holo-silver": "Adesivo holográfico prateado",
};

const BUSINESS_CARD_CATALOG = [
  ...["Couche 300g", "Offset 240g", "Metalizado branco 250g"].map((label) => ({
    id: `laser-${label.toLowerCase().replaceAll(" ", "-")}`,
    label,
    production: "Laser",
    modes: {
      "Só frente": [
        { quantity: 100, total: 42.5 },
        { quantity: 200, total: 63 },
        { quantity: 300, total: 97 },
        { quantity: 400, total: 108 },
        { quantity: 500, total: 119 },
        { quantity: 1000, total: 206 },
      ],
      "Frente e verso": [
        { quantity: 100, total: 67 },
        { quantity: 200, total: 115 },
        { quantity: 300, total: 140 },
        { quantity: 400, total: 172 },
        { quantity: 500, total: 200 },
        { quantity: 1000, total: 345 },
      ],
    },
  })),
  {
    id: "offset-couche-300g-verniz-brilho-total-frente",
    label: "Couche 300g verniz brilho total frente",
    production: "Offset",
    modes: {
      "Só frente": [
        { quantity: 1000, total: 140 },
        { quantity: 2000, total: 266 },
        { quantity: 3000, total: 400 },
        { quantity: 5000, total: 505 },
      ],
      "Frente e verso": [
        { quantity: 1000, total: 167 },
        { quantity: 2000, total: 321 },
        { quantity: 3000, total: 483 },
        { quantity: 5000, total: 580 },
      ],
    },
  },
  {
    id: "offset-couche-250g-verniz-brilho-total-frente",
    label: "Couche 250g verniz brilho total frente",
    production: "Offset",
    modes: {
      "Só frente": [
        { quantity: 1000, total: 121 },
        { quantity: 2000, total: 231 },
        { quantity: 3000, total: 352 },
        { quantity: 5000, total: 480 },
      ],
      "Frente e verso": [
        { quantity: 1000, total: 145 },
        { quantity: 2000, total: 278 },
        { quantity: 3000, total: 424 },
        { quantity: 5000, total: 500 },
      ],
    },
  },
  {
    id: "offset-papel-supremo-300g",
    label: "Papel supremo 300g",
    production: "Offset",
    modes: {
      "Frente e verso": [
        { quantity: 1000, total: 231 },
        { quantity: 2000, total: 448 },
        { quantity: 3000, total: 519 },
        { quantity: 5000, total: 854 },
      ],
    },
  },
  {
    id: "offset-couche-300g-laminacao-fosca-verniz-localizado",
    label: "Couche 300g com laminação fosca e verniz localizado frente e verso",
    production: "Offset",
    modes: {
      "Frente e verso": [
        { quantity: 500, total: 212 },
        { quantity: 1000, total: 254 },
        { quantity: 2000, total: 496 },
        { quantity: 3000, total: 732 },
        { quantity: 5000, total: 902 },
      ],
    },
  },
  {
    id: "offset-couche-300g-laminacao-fosca-hotstamping",
    label: "Couche 300g com laminação fosca e hotstamping",
    production: "Offset",
    modes: {
      "Só frente": [
        { quantity: 500, total: 426 },
        { quantity: 1000, total: 603 },
      ],
      "Frente e verso": [
        { quantity: 500, total: 481 },
        { quantity: 1000, total: 654 },
      ],
    },
  },
];

const FLYER_CATALOG = [
  ...["Couche 120g", "Offset 120g"].flatMap((paper) => [
    { production: "Laser", paper, size: "10x7cm", modes: { "Só frente": [[500, 131], [1000, 235], [2000, 433], [5000, 1040]], "Frente e verso": [[500, 261], [1000, 450], [2000, 830], [5000, 1870]] } },
    { production: "Laser", paper, size: "10x14cm", modes: { "Só frente": [[200, 104], [500, 197], [1000, 362], [2000, 709], [5000, 1573]], "Frente e verso": [[200, 205], [500, 393], [1000, 707], [2000, 1337], [5000, 2831]] } },
    { production: "Laser", paper, size: "14x20cm", modes: { "Só frente": [[100, 78], [200, 142], [300, 189], [500, 300], [750, 433], [1000, 591], [1500, 865], [2000, 1180], [3000, 1650]], "Frente e verso": [[100, 155], [200, 276], [300, 370], [500, 582], [750, 850], [1000, 1150], [1500, 1650], [2000, 2202], [3000, 3146]] } },
    { production: "Laser", paper, size: "9,5x20cm", modes: { "Só frente": [[200, 105], [500, 182], [750, 321], [1000, 432], [2000, 866], [3000, 1225], [5000, 2163]], "Frente e verso": [[200, 208], [500, 432], [750, 624], [1000, 840], [2000, 1644], [3000, 2508], [5000, 4152]] } },
    { production: "Laser", paper, size: "20x28,5cm", modes: { "Só frente": [[100, 138], [200, 268], [300, 398], [400, 519], [500, 657], [1000, 1297], [1500, 1947]], "Frente e verso": [[100, 288], [200, 514], [300, 796], [400, 1021], [500, 1297], [1000, 2561], [1500, 3875]] } },
  ]),
  { production: "Offset", paper: "Couche 90g", size: "10x14cm", modes: { "Só frente": [[2500, 290], [5000, 460], [10000, 684]], "Frente e verso": [[2500, 325], [5000, 470], [10000, 761]] } },
  { production: "Offset", paper: "Couche 90g", size: "14x20cm", modes: { "Só frente": [[2500, 455], [5000, 726], [10000, 1268]], "Frente e verso": [[2500, 510], [5000, 838], [10000, 1413]] } },
  { production: "Offset", paper: "Couche 90g", size: "20x28cm", modes: { "Só frente": [[2500, 891], [5000, 1345], [10000, 2344]], "Frente e verso": [[2500, 956], [5000, 1549], [10000, 2617]] } },
  { production: "Offset", paper: "Couche 90g", size: "28x40cm", modes: { "Só frente": [[2500, 1653], [5000, 2490]], "Frente e verso": [[2500, 1742], [5000, 2871]] } },
  { production: "Offset", paper: "Couche 115g", size: "10x15cm", modes: { "Só frente": [[2500, 379], [5000, 467], [10000, 924]], "Frente e verso": [[2500, 445], [5000, 527], [10000, 976]] } },
  { production: "Offset", paper: "Couche 115g", size: "10x20cm", modes: { "Só frente": [[2500, 440], [5000, 697]], "Frente e verso": [[2500, 531], [5000, 784]] } },
  { production: "Offset", paper: "Couche 115g", size: "15x20cm", modes: { "Só frente": [[2500, 597], [5000, 840], [10000, 1715]], "Frente e verso": [[2500, 702], [5000, 924], [10000, 1806]] } },
  { production: "Offset", paper: "Couche 115g", size: "20x30cm", modes: { "Só frente": [[2500, 1101], [5000, 1719], [10000, 3180]], "Frente e verso": [[2500, 1297], [5000, 1806], [10000, 3591]] } },
  { production: "Offset", paper: "Couche 115g", size: "30x40cm", modes: { "Só frente": [[2500, 2029], [5000, 3180]], "Frente e verso": [[2500, 2396], [5000, 3591]] } },
  { production: "Offset", paper: "Couche 150g", size: "10x15cm", modes: { "Só frente": [[2500, 440], [5000, 796], [10000, 1475]], "Frente e verso": [[2500, 458], [5000, 808], [10000, 1497]] } },
  { production: "Offset", paper: "Couche 150g", size: "10,5x21cm", modes: { "Só frente": [[2500, 796], [5000, 1475]], "Frente e verso": [[2500, 808], [5000, 1497]] } },
  { production: "Offset", paper: "Couche 150g", size: "15x21cm", modes: { "Só frente": [[2500, 796], [5000, 1475], [10000, 2484]], "Frente e verso": [[2500, 808], [5000, 1376], [10000, 2771]] } },
  { production: "Offset", paper: "Couche 150g", size: "20x29,7cm", modes: { "Só frente": [[2500, 1475], [5000, 2732], [10000, 5412]], "Frente e verso": [[2500, 1497], [5000, 2771], [10000, 5490]] } },
].map((item, index) => ({
  id: `flyer-${index + 1}`,
  ...item,
  modes: Object.fromEntries(Object.entries(item.modes).map(([mode, tiers]) => [
    mode,
    tiers.map(([quantity, total]) => ({ quantity, total })),
  ])),
}));

const READY_PRODUCT_CATALOG = [
  {
    id: "Cordão de crachá liso",
    label: "Cordão de crachá liso",
    category: "Cordões",
    pricingMode: "plainBadge",
  },
  {
    id: "Cordão estampado 20mm com jacaré",
    label: "Cordão estampado 20mm com jacaré",
    category: "Cordões",
    pricingMode: "printedBadge",
  },
  {
    id: "Cordão estampado 20mm com mosquetão",
    label: "Cordão estampado 20mm com mosquetão",
    category: "Cordões",
    pricingMode: "printedBadge",
  },
  {
    id: "Crachá PVC 4x0",
    label: "Crachá PVC 4x0",
    category: "Crachás",
    pricingMode: "tieredUnit",
    tiers: [
      { min: 1, value: 12.1, label: "01 un" },
      { min: 6, value: 11, label: "Acima de 05" },
      { min: 11, value: 9.9, label: "Acima de 10" },
      { min: 21, value: 8.8, label: "Acima de 20" },
    ],
  },
  {
    id: "Crachá PVC 4x1",
    label: "Crachá PVC 4x1",
    category: "Crachás",
    pricingMode: "tieredUnit",
    tiers: [
      { min: 1, value: 13.2, label: "01 un" },
      { min: 6, value: 11.1, label: "Acima de 05" },
      { min: 11, value: 10.5, label: "Acima de 10" },
      { min: 21, value: 9.35, label: "Acima de 20" },
    ],
  },
  {
    id: "Crachá PVC 4x4",
    label: "Crachá PVC 4x4",
    category: "Crachás",
    pricingMode: "tieredUnit",
    tiers: [
      { min: 1, value: 16, label: "01 un" },
      { min: 6, value: 14.3, label: "Acima de 05" },
      { min: 11, value: 13.2, label: "Acima de 10" },
      { min: 21, value: 12.7, label: "Acima de 20" },
    ],
  },
  {
    id: "Caneca de cerâmica",
    label: "Caneca de cerâmica",
    category: "Canecas",
    pricingMode: "tieredUnit",
    tiers: [
      { min: 1, value: 35, label: "1 un" },
      { min: 2, value: 27.5, label: "2 un ou mais" },
    ],
  },
  {
    id: "Caneca de vidro",
    label: "Caneca de vidro",
    category: "Canecas",
    pricingMode: "tieredUnit",
    tiers: [
      { min: 1, value: 40, label: "1 un" },
      { min: 2, value: 32.5, label: "2 un ou mais" },
    ],
  },
  {
    id: "Windbanner 3x0,75m completo com base de concreto",
    label: "Windbanner 3x0,75m completo com base de concreto",
    category: "Windbanner",
    unitPrice: 190,
  },
  {
    id: "Windbanner 2x0,75m completo com base de concreto",
    label: "Windbanner 2x0,75m completo com base de concreto",
    category: "Windbanner",
    unitPrice: 170,
  },
  {
    id: "Windbanner 3x0,75m completo com base de plástico",
    label: "Windbanner 3x0,75m completo com base de plástico",
    category: "Windbanner",
    unitPrice: 205,
  },
  {
    id: "Windbanner 2x0,75m completo com base de plástico",
    label: "Windbanner 2x0,75m completo com base de plástico",
    category: "Windbanner",
    unitPrice: 190,
  },
  {
    id: "Base de concreto grande para windbanner",
    label: "Base de concreto grande para windbanner",
    category: "Windbanner",
    unitPrice: 30,
  },
  {
    id: "Base de concreto pequena para windbanner",
    label: "Base de concreto pequena para windbanner",
    category: "Windbanner",
    unitPrice: 25,
  },
  {
    id: "Ferro para windbanner",
    label: "Ferro para windbanner",
    category: "Windbanner",
    unitPrice: 66,
  },
  {
    id: "Só tecido windbanner 3x0,75m",
    label: "Só tecido windbanner 3x0,75m",
    category: "Windbanner",
    unitPrice: 130,
  },
  {
    id: "Só tecido windbanner 2x0,75m",
    label: "Só tecido windbanner 2x0,75m",
    category: "Windbanner",
    unitPrice: 160,
  },
  {
    id: "Base de plástico para windbanner",
    label: "Base de plástico para windbanner",
    category: "Windbanner",
    unitPrice: 55,
  },
  {
    id: "P10 | Área 10x27mm",
    label: "P10 | Área 10x27mm",
    category: "Carimbos automáticos",
    unitPrice: 39,
  },
  {
    id: "P20 | Área 38x14mm",
    label: "P20 | Área 38x14mm",
    category: "Carimbos automáticos",
    unitPrice: 40,
  },
  {
    id: "P30 | Área 47x18mm",
    label: "P30 | Área 47x18mm",
    category: "Carimbos automáticos",
    unitPrice: 45,
  },
  {
    id: "P40 | Área 58x22mm",
    label: "P40 | Área 58x22mm",
    category: "Carimbos automáticos",
    unitPrice: 49,
  },
  {
    id: "P15 | Área 69x10mm",
    label: "P15 | Área 69x10mm",
    category: "Carimbos automáticos",
    unitPrice: 63,
  },
  {
    id: "P25 | Área 75x15mm",
    label: "P25 | Área 75x15mm",
    category: "Carimbos automáticos",
    unitPrice: 63,
  },
  {
    id: "P60 | Área 60x40mm",
    label: "P60 | Área 60x40mm",
    category: "Carimbos automáticos",
    unitPrice: 83.6,
  },
  {
    id: "P50 | Área 75x37mm",
    label: "P50 | Área 75x37mm",
    category: "Carimbos automáticos",
    unitPrice: 83.6,
  },
  {
    id: "Automático | Área 76x37mm",
    label: "Automático | Área 76x37mm",
    category: "Carimbos automáticos",
    unitPrice: 83.6,
  },
  {
    id: "Madeira | Área 65x40mm",
    label: "Madeira | Área 65x40mm",
    category: "Carimbos de madeira",
    unitPrice: 21.5,
  },
  {
    id: "Madeira | Área 70x25mm",
    label: "Madeira | Área 70x25mm",
    category: "Carimbos de madeira",
    unitPrice: 21.5,
  },
  {
    id: "Madeira | Área 70x15mm",
    label: "Madeira | Área 70x15mm",
    category: "Carimbos de madeira",
    unitPrice: 20,
  },
  {
    id: "Madeira | Área 70x6mm",
    label: "Madeira | Área 70x6mm",
    category: "Carimbos de madeira",
    unitPrice: 20,
  },
  {
    id: "Madeira | Área 50x20mm",
    label: "Madeira | Área 50x20mm",
    category: "Carimbos de madeira",
    unitPrice: 17.5,
  },
  {
    id: "Madeira | Área 50x15mm",
    label: "Madeira | Área 50x15mm",
    category: "Carimbos de madeira",
    unitPrice: 17.5,
  },
  {
    id: "Madeira | Área 30x6mm",
    label: "Madeira | Área 30x6mm",
    category: "Carimbos de madeira",
    unitPrice: 16.5,
  },
  {
    id: "Carimbo redondo 15mm",
    label: "Carimbo redondo 15mm",
    category: "Carimbos redondos",
    unitPrice: 19,
  },
  {
    id: "Carimbo redondo 20mm",
    label: "Carimbo redondo 20mm",
    category: "Carimbos redondos",
    unitPrice: 19,
  },
  {
    id: "Carimbo redondo 30mm",
    label: "Carimbo redondo 30mm",
    category: "Carimbos redondos",
    unitPrice: 20,
  },
  {
    id: "Carimbo redondo 35mm",
    label: "Carimbo redondo 35mm",
    category: "Carimbos redondos",
    unitPrice: 20,
  },
  {
    id: "Carimbo redondo 45mm",
    label: "Carimbo redondo 45mm",
    category: "Carimbos redondos",
    unitPrice: 23,
  },
  {
    id: "Carimbo redondo 50mm",
    label: "Carimbo redondo 50mm",
    category: "Carimbos redondos",
    unitPrice: 23,
  },
  {
    id: "Carimbo redondo 55mm",
    label: "Carimbo redondo 55mm",
    category: "Carimbos redondos",
    unitPrice: 23,
  },
  {
    id: "Só película",
    label: "Só película",
    category: "Acessórios de carimbo",
    unitPrice: 13.5,
  },
  {
    id: "Almofada",
    label: "Almofada",
    category: "Acessórios de carimbo",
    unitPrice: 21,
  },
  {
    id: "Tinta",
    label: "Tinta",
    category: "Acessórios de carimbo",
    unitPrice: 16,
  },
];

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
    credentialLanyardPricing: {
      roundWhite2mm: 0.75,
      plainBadge: 2.75,
      printed: [
        { min: 1, value: 8.0, label: "Até 19" },
        { min: 20, value: 6.5, label: "20 a 29" },
        { min: 30, value: 5.0, label: "30 a 49" },
        { min: 50, value: 4.0, label: "50 ou mais" },
      ],
      printedPackages: [
        { quantity: 10, total: 80, label: "10 un" },
        { quantity: 20, total: 130, label: "20 un" },
        { quantity: 30, total: 150, label: "30 un" },
        { quantity: 40, total: 200, label: "40 un" },
        { quantity: 50, total: 200, label: "50 un" },
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
    resinPricing: {
      minimumOrderPrice: 35,
      markupPercent: 0,
      pricingByMaterial: {
        standard: {
          tier1: 32,
          tier2: 30,
          tier5: 28,
          tier10: 24,
        },
        special: {
          tier1: 45,
          tier2: 40,
          tier5: 38,
          tier10: 35,
        },
      },
    },
    m2Pricing: {
      digitalCut: [
        { min: 1, value: 30, label: "Valor minimo" },
        { min: 2, value: 90, label: "até 2 m²" },
        { min: 4, value: 85, label: "de 2 até 4 m²" },
        { min: 6, value: 80, label: "de 4 até 6 m²" },
        { min: 10, value: 75, label: "de 6 até 10 m²" },
        { min: 1000000, value: 65, label: "acima de 10 m²" },
      ],
      uvCut: [
        { min: 1, value: 30, label: "Valor minimo" },
        { min: 2, value: 125, label: "até 2 m²" },
        { min: 4, value: 115, label: "de 2 até 4 m²" },
        { min: 6, value: 110, label: "de 4 até 6 m²" },
        { min: 10, value: 105, label: "de 6 até 10 m²" },
        { min: 1000000, value: 100, label: "acima de 10 m²" },
      ],
      uvVerniz: [
        { min: 1, value: 30, label: "Valor minimo" },
        { min: 2, value: 155, label: "até 2 m²" },
        { min: 4, value: 145, label: "de 2 até 4 m²" },
        { min: 6, value: 140, label: "de 4 até 6 m²" },
        { min: 10, value: 135, label: "de 6 até 10 m²" },
        { min: 1000000, value: 130, label: "acima de 10 m²" },
      ],
      flatCut: [
        { min: 1, value: 30, label: "Valor minimo" },
        { min: 2, value: 70, label: "até 2 m²" },
        { min: 4, value: 65, label: "de 2 até 4 m²" },
        { min: 6, value: 63, label: "de 4 até 6 m²" },
        { min: 10, value: 60, label: "de 6 até 10 m²" },
        { min: 1000000, value: 58, label: "acima de 10 m²" },
      ],
      banner: [
        { min: 1, value: 35, label: "Valor minimo" },
        { min: 2, value: 80, label: "até 2 m²" },
        { min: 4, value: 75, label: "de 2 até 4 m²" },
        { min: 6, value: 73, label: "de 4 até 6 m²" },
        { min: 10, value: 70, label: "de 6 até 10 m²" },
        { min: 1000000, value: 68, label: "acima de 10 m²" },
      ],
      perfurado: [
        { min: 1, value: 45, label: "Valor minimo" },
        { min: 5, value: 88, label: "de 1 até 5 m²" },
        { min: 1000000, value: 75, label: "acima de 5 m²" },
      ],
      ps1mm: [
        { min: 1, value: 39, label: "Valor minimo" },
        { min: 1, value: 176, label: "até 1 m²" },
        { min: 2, value: 164, label: "de 1 até 2 m²" },
        { min: 4, value: 152, label: "de 2 até 4 m²" },
        { min: 10, value: 146, label: "de 4 até 10 m²" },
        { min: 1000000, value: 144, label: "acima de 10 m²" },
      ],
      ps2mm: [
        { min: 1, value: 39, label: "Valor minimo" },
        { min: 1, value: 200, label: "até 1 m²" },
        { min: 2, value: 194, label: "de 1 até 2 m²" },
        { min: 4, value: 188, label: "de 2 até 4 m²" },
        { min: 10, value: 182, label: "de 4 até 10 m²" },
        { min: 1000000, value: 178, label: "acima de 10 m²" },
      ],
    },
    m2Finishes: [
      { id: "ilhós-simples", label: "Ilhós Simples", type: "eyelet", price: 0.9, spacingCm: 20 },
      { id: "ilhós-latão", label: "Ilhós Latão", type: "eyelet", price: 1.5, spacingCm: 20 },
      { id: "bainha-corda", label: "Bainha com corda", type: "perimeter", price: 5.0 },
      { id: "laminacao", label: "Laminação", type: "area", price: 25.0 },
      { id: "verniz-laka", label: "Verniz laka", type: "area", price: 5.0 },
    ],
    catalogSections: [],
    spiralPlasticDiscount: 1.5,
  };
}

function createDefaultRow(index) {
  return {
    id: `row-${index + 1}`,
    description: "",
    printType: "Preto e branco",
    size: "A4",
  printMode: "Só frente",
    finishing: "Sem acabamento",
    bindingGroup: "",
    quantity: 0,
    pages: 0,
    colorPages: 0,
    coverType: "Sem capa",
    coverPaper: "Sulfite 75g",
    backCoverType: "Sem contracapa",
    backCoverPaper: "Sulfite 75g",
    spiralOption: "Completa",
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultColorPrintRow(index) {
  return {
    id: `color-row-${index + 1}`,
    description: "",
    widthMm: 0,
    heightMm: 0,
    bleedMode: "Sem sangra",
    printMode: "Só frente",
    paperType: "Sulfite 75g",
    quantity: 0,
    cutPriceOverride: "",
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultM2Row(index) {
  return {
    id: `m2-row-${index + 1}`,
    productId: M2_CATALOG[0].id,
    description: DEFAULT_M2_DESCRIPTIONS[M2_CATALOG[0].id] || "",
    measureUnit: "cm",
    widthMm: 0,
    heightMm: 0,
    quantity: 0,
    finishIds: [],
    finishOverrides: {},
    extraCharge: 0,
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultCredentialRow(index) {
  return {
    id: `credential-row-${index + 1}`,
    description: "",
    materialType: "Couche 250g",
    printMode: "Só frente",
    lamination: "Sem laminação",
    lanyardType: "none",
    widthCm: 0,
    heightCm: 0,
    quantity: 0,
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultReadyProductRow(index) {
  return {
    id: `ready-product-row-${index + 1}`,
    productType: READY_PRODUCT_CATALOG[0]?.id || "",
    description: "",
    quantity: 0,
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultResinRow(index) {
  return {
    id: `resin-row-${index + 1}`,
    description: "Adesivo resinado",
    materialType: "white",
    widthMm: 0,
    heightMm: 0,
    quantity: 0,
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultBusinessCardRow(index) {
  return {
    id: `business-card-row-${index + 1}`,
    description: "",
    productionType: "Laser",
    materialId: BUSINESS_CARD_CATALOG[0]?.id || "",
    printMode: "Só frente",
    quantity: 0,
    extraFinish: "Sem acabamento adicional",
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function createDefaultFlyerRow(index) {
  return {
    id: `flyer-row-${index + 1}`,
    description: "",
    productionType: "Laser",
    catalogId: FLYER_CATALOG[0]?.id || "",
    printMode: "Só frente",
    quantity: 0,
    foldType: "Sem dobra",
    artCreationFee: 0,
    discountType: "R$",
    discountValue: 0,
  };
}

function getDefaultM2Description(productId) {
  return DEFAULT_M2_DESCRIPTIONS[productId] || "";
}

function getM2RowDescription(row) {
  return (row.description || "").trim() || getDefaultM2Description(row.productId) || row.productLabel || "";
}

function createDefaultState() {
  return {
    calcMode: "Independente",
    m2CalcMode: "Independente",
    presets: {
      printType: "Preto e branco",
      size: "A4",
      printMode: "Só frente",
      finishing: "Sem acabamento",
      coverType: "Sem capa",
      coverPaper: "Sulfite 75g",
      backCoverType: "Sem contracapa",
      backCoverPaper: "Sulfite 75g",
      spiralOption: "Completa",
    },
    rows: Array.from({ length: 5 }, (_, index) => createDefaultRow(index)),
    colorPrintItems: Array.from({ length: 5 }, (_, index) => createDefaultColorPrintRow(index)),
    credentialItems: Array.from({ length: 5 }, (_, index) => createDefaultCredentialRow(index)),
    readyProductItems: Array.from({ length: 5 }, (_, index) => createDefaultReadyProductRow(index)),
    m2Items: Array.from({ length: 5 }, (_, index) => createDefaultM2Row(index)),
    resinItems: Array.from({ length: 5 }, (_, index) => createDefaultResinRow(index)),
    businessCardItems: Array.from({ length: 5 }, (_, index) => createDefaultBusinessCardRow(index)),
    flyerItems: Array.from({ length: 5 }, (_, index) => createDefaultFlyerRow(index)),
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
    clients: [],
    quoteHistory: [],
    paymentTerms: "",
    productionDeadline: "",
    quoteNotes: "",
    quoteDiscountType: "R$",
    quoteDiscountValue: 0,
  };
}

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeCatalogSections(list) {
  if (!Array.isArray(list)) {
    return [];
  }

  const normalized = [];
  for (const item of list) {
    if (!item || typeof item !== "object") {
      continue;
    }
    if (Array.isArray(item.products)) {
      const tab = item.tab === "calculo" || item.tab === "impressos" || item.tab === "credenciais" || item.tab === "produtos-prontos" || item.tab === "cartoes" || item.tab === "panfletos" || item.tab === "m2" ? item.tab : "m2";
      for (const product of item.products) {
        if (!product || typeof product !== "object") {
          continue;
        }
        normalized.push({
          id: product.id || `produto-${Date.now()}`,
          label: product.label || "Novo produto",
          tab,
          note: product.note || "",
        });
      }
      continue;
    }
    if (item.tab === "calculo" || item.tab === "impressos" || item.tab === "credenciais" || item.tab === "produtos-prontos" || item.tab === "cartoes" || item.tab === "panfletos" || item.tab === "m2") {
      normalized.push({
        id: item.id || `produto-${Date.now()}`,
        label: item.label || item.name || "Novo produto",
        tab: item.tab,
        pricingKey: item.tab === "m2" ? (item.pricingKey || "banner") : "",
        note: item.note || "",
      });
    }
  }
  return normalized;
}

function createUniqueM2PricingKey(baseKey, existingKeys) {
  const base = `custom-${baseKey}`.toLowerCase().replace(/[^a-z0-9-]/g, "-");
  let candidate = base;
  let counter = 1;
  while (existingKeys.has(candidate)) {
    candidate = `${base}-${counter}`;
    counter += 1;
  }
  existingKeys.add(candidate);
  return candidate;
}

function normalizeM2Finishes(candidateFinishes, defaultFinishes) {
  const defaults = Array.isArray(defaultFinishes) ? defaultFinishes : [];
  if (!Array.isArray(candidateFinishes) || candidateFinishes.length === 0) {
    return deepClone(defaults);
  }

  const normalized = candidateFinishes
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `acabamento-${Date.now()}-${index}`,
      label: item.label || "Novo acabamento",
      type: item.type || "area",
      price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
      spacingCm: item.spacingCm === "" || item.spacingCm == null ? "" : Number(item.spacingCm),
    }));

  const existingKeys = new Set(
    normalized.map((item) => `${String(item.id || "").trim().toLowerCase()}::${String(item.label || "").trim().toLowerCase()}`)
  );

  for (const finish of defaults) {
    const key = `${String(finish.id || "").trim().toLowerCase()}::${String(finish.label || "").trim().toLowerCase()}`;
    if (!existingKeys.has(key)) {
      normalized.push(deepClone(finish));
    }
  }

  return normalized;
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

  if (candidate.credentialLanyardPricing && typeof candidate.credentialLanyardPricing === "object") {
    merged.credentialLanyardPricing = {
      ...merged.credentialLanyardPricing,
      ...candidate.credentialLanyardPricing,
      printed: Array.isArray(candidate.credentialLanyardPricing.printed)
        ? candidate.credentialLanyardPricing.printed
        : merged.credentialLanyardPricing.printed,
      printedPackages: Array.isArray(candidate.credentialLanyardPricing.printedPackages)
        ? candidate.credentialLanyardPricing.printedPackages
        : merged.credentialLanyardPricing.printedPackages,
    };
  }

  if (candidate.cutPricing && typeof candidate.cutPricing === "object") {
    if (Array.isArray(candidate.cutPricing.upToFiveSheets)) {
      merged.cutPricing.upToFiveSheets = candidate.cutPricing.upToFiveSheets;
    }
    if (Number.isFinite(Number(candidate.cutPricing.aboveFiveSheetsPerCut))) {
      merged.cutPricing.aboveFiveSheetsPerCut = Number(candidate.cutPricing.aboveFiveSheetsPerCut);
    }
  }

  if (candidate.resinPricing && typeof candidate.resinPricing === "object") {
    merged.resinPricing = {
      ...merged.resinPricing,
      ...candidate.resinPricing,
      pricingByMaterial: {
        standard: {
          ...merged.resinPricing.pricingByMaterial.standard,
          ...(candidate.resinPricing.pricingByMaterial?.standard || {}),
        },
        special: {
          ...merged.resinPricing.pricingByMaterial.special,
          ...(candidate.resinPricing.pricingByMaterial?.special || {}),
        },
      },
    };
  }

  merged.m2Finishes = normalizeM2Finishes(candidate.m2Finishes, defaults.m2Finishes);

  if (Array.isArray(candidate.catalogSections)) {
    merged.catalogSections = normalizeCatalogSections(candidate.catalogSections);
  }

  if (candidate.m2Pricing && typeof candidate.m2Pricing === "object") {
    for (const key of Object.keys(merged.m2Pricing)) {
      if (Array.isArray(candidate.m2Pricing[key])) {
        merged.m2Pricing[key] = candidate.m2Pricing[key];
      }
    }
    for (const key of Object.keys(candidate.m2Pricing)) {
      if (!(key in merged.m2Pricing) && Array.isArray(candidate.m2Pricing[key])) {
        merged.m2Pricing[key] = candidate.m2Pricing[key];
      }
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
  state.m2CalcMode = OPTIONS.m2CalcModes.includes(candidate.m2CalcMode) ? candidate.m2CalcMode : state.m2CalcMode;
  state.presets = { ...state.presets, ...(candidate.presets || {}) };
  state.client = { ...state.client, ...(candidate.client || {}) };
  state.company = { ...state.company, ...(candidate.company || {}) };
  state.clients = Array.isArray(candidate.clients)
    ? candidate.clients
        .filter((client) => client && typeof client === "object")
        .map((client, index) => ({
          id: client.id || `client-${index + 1}`,
          name: typeof client.name === "string" ? client.name : "",
          contact: typeof client.contact === "string" ? client.contact : "",
          cnpj: typeof client.cnpj === "string" ? client.cnpj : "",
          notes: typeof client.notes === "string" ? client.notes : "",
          createdAt: typeof client.createdAt === "string" ? client.createdAt : new Date().toISOString(),
        }))
    : state.clients;
  state.quoteHistory = Array.isArray(candidate.quoteHistory)
    ? candidate.quoteHistory
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
          id: item.id || `quote-${index + 1}`,
          title: typeof item.title === "string" ? item.title : "",
          clientName: typeof item.clientName === "string" ? item.clientName : "",
          total: Number.isFinite(Number(item.total)) ? Number(item.total) : 0,
          summary: typeof item.summary === "string" ? item.summary : "",
          createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString(),
        }))
    : state.quoteHistory;
  state.paymentTerms = typeof candidate.paymentTerms === "string" ? candidate.paymentTerms : state.paymentTerms;
  state.productionDeadline = typeof candidate.productionDeadline === "string" ? candidate.productionDeadline : state.productionDeadline;
  state.quoteNotes = typeof candidate.quoteNotes === "string" ? candidate.quoteNotes : state.quoteNotes;
  state.quoteDiscountType = normalizeDiscountType(candidate.quoteDiscountType);
  state.quoteDiscountValue = toMoneyNumber(candidate.quoteDiscountValue);

  if (Array.isArray(candidate.rows) && candidate.rows.length > 0) {
    state.rows = candidate.rows.map((row, index) => ({
      ...createDefaultRow(index),
      ...row,
      quantity: toWholeNumber(row?.quantity),
      pages: toWholeNumber(row?.pages),
      colorPages: toWholeNumber(row?.colorPages),
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
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
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `color-row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.credentialItems) && candidate.credentialItems.length > 0) {
    state.credentialItems = candidate.credentialItems.map((row, index) => ({
      ...createDefaultCredentialRow(index),
      ...row,
      widthCm: toDecimalNumber(row?.widthCm),
      heightCm: toDecimalNumber(row?.heightCm),
      quantity: toWholeNumber(row?.quantity),
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `credential-row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.readyProductItems) && candidate.readyProductItems.length > 0) {
    state.readyProductItems = candidate.readyProductItems.map((row, index) => ({
      ...createDefaultReadyProductRow(index),
      ...row,
      quantity: toWholeNumber(row?.quantity),
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `ready-product-row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.m2Items) && candidate.m2Items.length > 0) {
    const normalizedCatalogSections = normalizeCatalogSections(candidate.catalogSections);
    const validM2Catalog = new Set(getM2Catalog({ catalogSections: normalizedCatalogSections }).map((product) => product.id));
    state.catalogSections = normalizedCatalogSections;
    state.m2Items = candidate.m2Items.map((row, index) => ({
      ...createDefaultM2Row(index),
      ...row,
      widthMm: toDecimalNumber(row?.widthMm),
      heightMm: toDecimalNumber(row?.heightMm),
      measureUnit: row?.measureUnit === "m" ? "m" : "cm",
      quantity: toWholeNumber(row?.quantity),
      finishIds: Array.isArray(row?.finishIds) ? row.finishIds.filter((item) => typeof item === "string") : [],
      finishOverrides: row?.finishOverrides && typeof row.finishOverrides === "object" && !Array.isArray(row.finishOverrides)
        ? Object.fromEntries(
            Object.entries(row.finishOverrides)
              .filter(([key]) => typeof key === "string")
              .map(([key, value]) => [key, value === "" || value === null ? "" : toWholeNumber(value)])
          )
        : {},
      extraCharge: toMoneyNumber(
        typeof row?.extraCharge !== "undefined" ? row.extraCharge : row?.finishingExtra
      ),
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      productId: validM2Catalog.has(row?.productId) ? row.productId : M2_CATALOG[0].id,
      id: row?.id || `m2-row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.resinItems) && candidate.resinItems.length > 0) {
    state.resinItems = candidate.resinItems.map((row, index) => ({
      ...createDefaultResinRow(index),
      ...row,
      widthMm: toDecimalNumber(row?.widthMm),
      heightMm: toDecimalNumber(row?.heightMm),
      quantity: toWholeNumber(row?.quantity),
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `resin-row-${index + 1}`,
    }));
  } else if (candidate.resinItem && typeof candidate.resinItem === "object") {
    state.resinItems = Array.from({ length: 5 }, (_, index) => createDefaultResinRow(index));
    state.resinItems[0] = {
      ...state.resinItems[0],
      ...candidate.resinItem,
      widthMm: toDecimalNumber(candidate.resinItem.widthMm),
      heightMm: toDecimalNumber(candidate.resinItem.heightMm),
      quantity: toWholeNumber(candidate.resinItem.quantity),
      artCreationFee: toMoneyNumber(candidate.resinItem.artCreationFee),
      discountType: normalizeDiscountType(candidate.resinItem.discountType),
      discountValue: toMoneyNumber(candidate.resinItem.discountValue),
      id: "resin-row-1",
    };
  }

  if (Array.isArray(candidate.businessCardItems) && candidate.businessCardItems.length > 0) {
    state.businessCardItems = candidate.businessCardItems.map((row, index) => ({
      ...createDefaultBusinessCardRow(index),
      ...row,
      productionType: OPTIONS.businessCardProductions.includes(row?.productionType) ? row.productionType : "Laser",
      printMode: OPTIONS.businessCardPrintModes.includes(row?.printMode) ? row.printMode : "Só frente",
      quantity: toWholeNumber(row?.quantity),
      extraFinish: OPTIONS.businessCardExtraFinish.includes(row?.extraFinish) ? row.extraFinish : "Sem acabamento adicional",
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `business-card-row-${index + 1}`,
    }));
  }

  if (Array.isArray(candidate.flyerItems) && candidate.flyerItems.length > 0) {
    state.flyerItems = candidate.flyerItems.map((row, index) => ({
      ...createDefaultFlyerRow(index),
      ...row,
      productionType: OPTIONS.flyerProductions.includes(row?.productionType) ? row.productionType : "Laser",
      printMode: OPTIONS.flyerPrintModes.includes(row?.printMode) ? row.printMode : "Só frente",
      quantity: toWholeNumber(row?.quantity),
      foldType: OPTIONS.flyerFolds.includes(row?.foldType) ? row.foldType : "Sem dobra",
      artCreationFee: toMoneyNumber(row?.artCreationFee),
      discountType: normalizeDiscountType(row?.discountType),
      discountValue: toMoneyNumber(row?.discountValue),
      id: row?.id || `flyer-row-${index + 1}`,
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

function loadSessionFlag(key) {
  if (typeof sessionStorage === "undefined") {
    return false;
  }

  try {
    return sessionStorage.getItem(key) === "true";
  } catch {
    return false;
  }
}

function saveSessionFlag(key, value) {
  if (typeof sessionStorage === "undefined") {
    return;
  }

  if (value) {
    sessionStorage.setItem(key, "true");
    return;
  }

  sessionStorage.removeItem(key);
}

async function requestSharedState(method = "GET", payload) {
  if (typeof fetch !== "function") {
    throw new Error("fetch-unavailable");
  }

  const response = await fetch(SHARED_API_PATH, {
    method,
    headers: payload ? { "Content-Type": "application/json" } : undefined,
    body: payload ? JSON.stringify(payload) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`shared-http-${response.status}`);
  }

  return response.json();
}

function loadConfigViewMode() {
  if (typeof localStorage === "undefined") {
    return "basic";
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.configView);
    return raw === "advanced" ? "advanced" : "basic";
  } catch {
    return "basic";
  }
}

function saveConfigViewMode(mode) {
  if (typeof localStorage === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_KEYS.configView, mode === "advanced" ? "advanced" : "basic");
}

function loadConfigSection() {
  if (typeof localStorage === "undefined") {
    return "calculo";
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.configSection);
    return raw === "impressos" || raw === "credenciais" || raw === "produtos-prontos" || raw === "cartoes" || raw === "panfletos" || raw === "m2" || raw === "resinados" ? raw : "calculo";
  } catch {
    return "calculo";
  }
}

function saveConfigSection(section) {
  if (typeof localStorage === "undefined") {
    return;
  }
  const safeSection = section === "impressos" || section === "credenciais" || section === "produtos-prontos" || section === "cartoes" || section === "panfletos" || section === "m2" || section === "resinados" ? section : "calculo";
  localStorage.setItem(STORAGE_KEYS.configSection, safeSection);
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

function normalizeDiscountType(value) {
  return value === "%" ? "%" : "R$";
}

function formatDiscountValue(type, value) {
  const safeType = normalizeDiscountType(type);
  const safeValue = toMoneyNumber(value);
  if (safeType === "%") {
    return `${formatMeasure(safeValue)}%`;
  }
  return formatCurrency(safeValue);
}

function calculateDiscount(subtotal, type, value) {
  const safeSubtotal = Math.max(0, toMoneyNumber(subtotal));
  const safeType = normalizeDiscountType(type);
  const safeValue = toMoneyNumber(value);
  const rawAmount = safeType === "%"
    ? safeSubtotal * (Math.min(safeValue, 100) / 100)
    : safeValue;
  const amount = safeValue > 0 ? Math.min(safeSubtotal, Math.max(0, rawAmount)) : 0;
  const total = Math.max(0, safeSubtotal - amount);
  return {
    type: safeType,
    value: safeValue,
    amount,
    total,
    hasDiscount: amount > 0,
    description: amount > 0 ? `Desconto: ${formatDiscountValue(safeType, safeValue)} (-${formatCurrency(amount)})` : "",
  };
}

function applyRowDiscount(row, subtotal, quantity) {
  const discount = calculateDiscount(subtotal, row.discountType, row.discountValue);
  return {
    subtotalBeforeDiscount: Math.max(0, toMoneyNumber(subtotal)),
    discountType: discount.type,
    discountValue: discount.value,
    discountAmount: discount.amount,
    discountDescription: discount.description,
    total: discount.total,
    unitValue: quantity > 0 ? discount.total / quantity : 0,
  };
}

function getArtCreationFee(row) {
  return toMoneyNumber(row?.artCreationFee);
}

function formatArtCreationDetail(row) {
  const value = getArtCreationFee(row);
  return value > 0 ? `Criação de arte: ${formatCurrency(value)}` : "";
}

function formatDateTime(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function formatMeasure(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatAreaM2(value) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 4,
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

function getPrintAggregationKey(printType, printMode) {
  if (printType === "Preto e branco") {
    return `${printType}::${printMode === "Frente e verso" ? "Frente e verso" : "Só frente"}`;
  }

  return printType;
}

function getApplicableBlackWhiteTiers(config, printMode) {
  const tiers = Array.isArray(config?.printPricing?.blackWhite) ? config.printPricing.blackWhite : [];
  if (printMode === "Frente e verso") {
    return tiers;
  }

  return tiers.filter((tier) => Number(tier?.min || 0) < 1000);
}

function getBlackWhiteTotal(rowImpressions, effectiveQuantity, config, printMode) {
  if (rowImpressions <= 0 || effectiveQuantity <= 0) {
    return 0;
  }

  const tiers = getApplicableBlackWhiteTiers(config, printMode);
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

function getPrintTotalByType(printType, rowImpressions, effectiveQuantity, config, printMode) {
  if (printType === "Preto e branco") {
    return getBlackWhiteTotal(rowImpressions, effectiveQuantity, config, printMode);
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
  const discount = ["Sem capas plásticas", "Sem capas plasticas"].includes(row.spiralOption) ? Number(config.spiralPlasticDiscount || 0) : 0;
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

function getNormalizedColorPages(row) {
  const totalPages = Math.max(0, toWholeNumber(row.pages));
  const colorPages = Math.max(0, toWholeNumber(row.colorPages));
  return Math.min(colorPages, totalPages);
}

function getPagesPerA4(pageCount, size) {
  if (pageCount <= 0) {
    return 0;
  }
  return size === "A5" ? Math.ceil(pageCount / 2) : pageCount;
}

function getInnerImpressionBreakdown(row) {
  const copies = Math.max(0, row.quantity);
  const totalPages = Math.max(0, row.pages);
  const colorPages = getNormalizedColorPages(row);
  if (copies <= 0 || totalPages <= 0) {
    return {
      totalImpressions: 0,
      blackWhiteImpressions: 0,
      colorImpressions: 0,
      blackWhitePagesPerCopy: 0,
      colorPagesPerCopy: 0,
      normalizedColorPages: 0,
    };
  }

  const fullColorMode = row.printType !== "Preto e branco" && colorPages === 0;
  const colorPagesPerCopy = fullColorMode ? totalPages : colorPages;
  const blackWhitePagesPerCopy = fullColorMode ? 0 : Math.max(0, totalPages - colorPagesPerCopy);
  const colorImpressions = copies * getPagesPerA4(colorPagesPerCopy, row.size);
  const blackWhiteImpressions = copies * getPagesPerA4(blackWhitePagesPerCopy, row.size);

  return {
    totalImpressions: colorImpressions + blackWhiteImpressions,
    blackWhiteImpressions,
    colorImpressions,
    blackWhitePagesPerCopy,
    colorPagesPerCopy,
    normalizedColorPages: colorPages,
  };
}

function buildApostilaPrintDetail(row) {
  const totalPages = Math.max(0, toWholeNumber(row.pages));
  const colorPages = getNormalizedColorPages(row);
  const blackWhitePages = Math.max(0, totalPages - colorPages);

  if (colorPages > 0) {
    return `${blackWhitePages} PB + ${colorPages} coloridas (tabela da capa em Sulfite 75g)`;
  }

  if (row.printType === "Preto e branco") {
    return "Preto e branco";
  }

  return row.printType;
}

function isColorPrintRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0 || Number(row.widthMm) > 0 || Number(row.heightMm) > 0);
}

function isCredentialRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0 || Number(row.widthCm) > 0 || Number(row.heightCm) > 0);
}

function isBusinessCardRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0);
}

function getBusinessCardMaterials(productionType) {
  const production = OPTIONS.businessCardProductions.includes(productionType) ? productionType : "Laser";
  return BUSINESS_CARD_CATALOG.filter((item) => item.production === production);
}

function getBusinessCardMaterial(materialId, productionType) {
  const materials = getBusinessCardMaterials(productionType);
  return materials.find((item) => item.id === materialId) || materials[0] || BUSINESS_CARD_CATALOG[0];
}

function getBusinessCardValidPrintMode(material, printMode) {
  const availableModes = Object.keys(material?.modes || {});
  if (availableModes.includes(printMode)) {
    return printMode;
  }
  return availableModes[0] || "Só frente";
}

function getBusinessCardTier(material, printMode, quantity) {
  const tiers = [...(material?.modes?.[printMode] || [])].sort((a, b) => a.quantity - b.quantity);
  if (!tiers.length) {
    return null;
  }
  return tiers.find((tier) => quantity === tier.quantity) || null;
}

function getBusinessCardQuantityOptions(material, printMode) {
  return [...(material?.modes?.[printMode] || [])].sort((a, b) => a.quantity - b.quantity);
}

function normalizeBusinessCardRowChoice(row) {
  const material = getBusinessCardMaterial(row.materialId, row.productionType);
  row.materialId = material?.id || "";
  row.printMode = getBusinessCardValidPrintMode(material, row.printMode);
  const options = getBusinessCardQuantityOptions(material, row.printMode);
  const quantity = toWholeNumber(row.quantity);
  if (quantity > 0 && !options.some((tier) => tier.quantity === quantity)) {
    row.quantity = options[0]?.quantity || 0;
  }
}

function buildBusinessCardMaterialOptions(productionType, currentValue) {
  return getBusinessCardMaterials(productionType)
    .map((material) => `<option value="${escapeHtml(material.id)}"${material.id === currentValue ? " selected" : ""}>${escapeHtml(material.label)}</option>`)
    .join("");
}

function buildBusinessCardPrintModeOptions(material, currentValue) {
  return Object.keys(material?.modes || {})
    .map((mode) => `<option value="${escapeHtml(mode)}"${mode === currentValue ? " selected" : ""}>${escapeHtml(mode)}</option>`)
    .join("");
}

function buildBusinessCardQuantityOptions(material, printMode, currentValue) {
  const options = getBusinessCardQuantityOptions(material, printMode);
  return [
    `<option value="0"${toWholeNumber(currentValue) <= 0 ? " selected" : ""}>Escolher</option>`,
    ...options.map((tier) => `<option value="${escapeHtml(tier.quantity)}"${toWholeNumber(currentValue) === tier.quantity ? " selected" : ""}>${formatInteger(tier.quantity)} cartões - ${formatCurrency(tier.total)}</option>`),
  ].join("");
}

function calculateBusinessCardExtraFinishTotal(quantity, extraFinish) {
  if (extraFinish !== "Com acabamento adicional" || quantity < 100) {
    return 0;
  }
  if (quantity >= 1000) {
    return Math.ceil(quantity / 1000) * 25;
  }
  return 10 + Math.ceil(quantity / 100) * 3;
}

function isFlyerRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0);
}

function getFlyerCatalogByProduction(productionType) {
  const production = OPTIONS.flyerProductions.includes(productionType) ? productionType : "Laser";
  return FLYER_CATALOG.filter((item) => item.production === production);
}

function getFlyerSelection(catalogId, productionType) {
  const options = getFlyerCatalogByProduction(productionType);
  return options.find((item) => item.id === catalogId) || options[0] || FLYER_CATALOG[0];
}

function getFlyerValidPrintMode(item, printMode) {
  const modes = Object.keys(item?.modes || {});
  return modes.includes(printMode) ? printMode : modes[0] || "Só frente";
}

function getFlyerQuantityOptions(item, printMode) {
  return [...(item?.modes?.[printMode] || [])].sort((a, b) => a.quantity - b.quantity);
}

function getFlyerTier(item, printMode, quantity) {
  return getFlyerQuantityOptions(item, printMode).find((tier) => tier.quantity === quantity) || null;
}

function normalizeFlyerRowChoice(row) {
  const item = getFlyerSelection(row.catalogId, row.productionType);
  row.catalogId = item?.id || "";
  row.printMode = getFlyerValidPrintMode(item, row.printMode);
  const options = getFlyerQuantityOptions(item, row.printMode);
  const quantity = toWholeNumber(row.quantity);
  if (quantity > 0 && !options.some((tier) => tier.quantity === quantity)) {
    row.quantity = options[0]?.quantity || 0;
  }
}

function buildFlyerCatalogOptions(productionType, currentValue) {
  return getFlyerCatalogByProduction(productionType)
    .map((item) => `<option value="${escapeHtml(item.id)}"${item.id === currentValue ? " selected" : ""}>${escapeHtml(`${item.paper} | ${item.size}`)}</option>`)
    .join("");
}

function buildFlyerPrintModeOptions(item, currentValue) {
  return Object.keys(item?.modes || {})
    .map((mode) => `<option value="${escapeHtml(mode)}"${mode === currentValue ? " selected" : ""}>${escapeHtml(mode)}</option>`)
    .join("");
}

function buildFlyerQuantityOptions(item, printMode, currentValue) {
  return [
    `<option value="0"${toWholeNumber(currentValue) <= 0 ? " selected" : ""}>Escolher</option>`,
    ...getFlyerQuantityOptions(item, printMode).map((tier) => `<option value="${escapeHtml(tier.quantity)}"${toWholeNumber(currentValue) === tier.quantity ? " selected" : ""}>${formatInteger(tier.quantity)} un - ${formatCurrency(tier.total)}</option>`),
  ].join("");
}

function calculateFlyerFoldTotal(quantity, foldType) {
  if (foldType === "1 dobra") {
    if (quantity >= 1000) {
      return Math.ceil(quantity / 1000) * 50;
    }
    return quantity >= 100 ? 10 + Math.ceil(quantity / 100) * 5 : 0;
  }
  if (foldType === "2 dobras") {
    if (quantity >= 1000) {
      return Math.ceil(quantity / 1000) * 100;
    }
    return quantity >= 100 ? 20 + Math.ceil(quantity / 100) * 10 : 0;
  }
  return 0;
}

function getCredentialMaterialConfig(materialType) {
  const material = materialType || "Couche 250g";
  if (material === "PS 1mm") {
    return { label: material, pricingMode: "m2", pricingKey: "ps1mm" };
  }
  if (material === "PS 2mm") {
    return { label: material, pricingMode: "m2", pricingKey: "ps2mm" };
  }
  return { label: material, pricingMode: "a4", paperType: material };
}

function getCredentialLaminationPrice(config) {
  const finishes = Array.isArray(config.m2Finishes) ? config.m2Finishes : [];
  const lamination = finishes.find((finish) => String(finish.id || "").toLowerCase() === "laminacao")
    || finishes.find((finish) => String(finish.label || "").trim().toLowerCase() === "laminação".toLowerCase())
    || finishes.find((finish) => String(finish.label || "").trim().toLowerCase() === "laminacao");
  return toMoneyNumber(lamination?.price);
}

function getCredentialLanyardOptions(config, quantity = 0) {
  const pricing = config?.credentialLanyardPricing || {};
  return [
    {
      id: "none",
      label: "Sem cordão",
      hint: "Use esta opção quando a credencial for entregue sem acessório.",
      unitPrice: 0,
    },
    {
      id: "round-white-2mm",
      label: "Cordão Roliço branco 2mm",
      hint: `${formatCurrency(pricing.roundWhite2mm)} por unidade`,
      unitPrice: toMoneyNumber(pricing.roundWhite2mm),
    },
  ];
}

function getCredentialLanyardSelection(config, lanyardType, quantity = 0) {
  const options = getCredentialLanyardOptions(config, quantity);
  return options.find((item) => item.id === lanyardType) || options[0];
}

function isReadyProductRowActive(row) {
  return Boolean(row.description?.trim() || Number(row.quantity) > 0);
}

function getReadyProductSelection(config, productType, quantity = 0) {
  const pricing = config?.credentialLanyardPricing || {};
  const printedPackages = Array.isArray(pricing.printedPackages) ? pricing.printedPackages : [];
  const requestedQuantity = Math.max(1, toWholeNumber(quantity));
  const packageQuantity = Math.ceil(requestedQuantity / 10) * 10;
  const packageTier =
    printedPackages.find((tier) => toWholeNumber(tier.quantity) >= packageQuantity) ||
    printedPackages[printedPackages.length - 1] ||
    null;
  const tierQuantity = toWholeNumber(packageTier?.quantity);
  const printedPackageQuantity = Math.max(packageQuantity, tierQuantity);
  const printedPackageTotal = packageTier
    ? printedPackageQuantity > tierQuantity && tierQuantity > 0
      ? printedPackageQuantity * (toMoneyNumber(packageTier.total) / tierQuantity)
      : toMoneyNumber(packageTier.total)
    : 0;
  const options = READY_PRODUCT_CATALOG.map((item) => {
    let unitPrice = toMoneyNumber(item.unitPrice);
    let totalPrice = null;
    let billedQuantity = requestedQuantity;
    let packageLabel = "";
    if (item.pricingMode === "plainBadge") {
      unitPrice = toMoneyNumber(pricing.plainBadge);
    } else if (item.pricingMode === "printedBadge") {
      billedQuantity = printedPackageQuantity;
      totalPrice = printedPackageTotal;
      unitPrice = billedQuantity > 0 ? totalPrice / billedQuantity : 0;
      packageLabel = packageTier?.label || `${billedQuantity} un`;
    } else if (item.pricingMode === "tieredUnit") {
      unitPrice = lookupTier(item.tiers || [], requestedQuantity);
    }

    return {
      ...item,
      unitPrice,
      totalPrice,
      billedQuantity,
      packageLabel,
    };
  });
  return options.find((item) => item.id === productType) || options[0];
}

function getCredentialMinimumBand(pricing) {
  if (!Array.isArray(pricing)) {
    return null;
  }
  return pricing.find((tier) => String(tier.label || "").toLowerCase().includes("valor minimo")) || null;
}

function calculateCredentialWorkbook(state, config) {
  const warnings = [];
  const laminationPricePerM2 = getCredentialLaminationPrice(config);

  const rows = state.credentialItems.map((row, index) => {
    const widthCm = toDecimalNumber(row.widthCm);
    const heightCm = toDecimalNumber(row.heightCm);
    const quantity = toWholeNumber(row.quantity);
    const active = isCredentialRowActive(row);
    const material = getCredentialMaterialConfig(row.materialType);
    const lanyard = getCredentialLanyardSelection(config, row.lanyardType, quantity);
    const printMode = row.printMode === "Frente e verso" ? "Frente e verso" : "Só frente";
    const sides = printMode === "Frente e verso" ? 2 : 1;
    const widthMm = widthCm * 10;
    const heightMm = heightCm * 10;
    const areaM2 = (widthCm * heightCm * quantity) / 10000;
    const laminationSelected = row.lamination === "Com laminação";
    const lanyardTotal = quantity * lanyard.unitPrice;
    const artCreationFee = getArtCreationFee(row);

    const baseRow = {
      ...row,
      active,
      valid: false,
      widthCm,
      heightCm,
      quantity,
      materialType: material.label,
      materialLabel: material.label,
      printMode,
      lanyardType: lanyard.id,
      lanyardLabel: lanyard.label,
      lanyardUnitPrice: lanyard.unitPrice,
      areaM2,
      itemsPerSheet: 0,
      sheetsNeeded: 0,
      impressionsNeeded: 0,
      rotated: false,
      sheetPrice: 0,
      pricePerM2: 0,
      tierLabel: "-",
      baseTotal: 0,
      laminationTotal: 0,
      lanyardTotal,
      artCreationFee,
      subtotalBeforeDiscount: 0,
      discountAmount: 0,
      discountDescription: "",
      total: 0,
      unitValue: 0,
      warning: "",
    };

    if (!active) {
      return baseRow;
    }

    if (widthCm <= 0 || heightCm <= 0 || quantity <= 0) {
      return {
        ...baseRow,
        warning: `Credencial ${index + 1}: preencha largura, altura e quantidade maiores que zero.`,
      };
    }

    if (material.pricingMode === "a4") {
      if ((widthMm > A4_WIDTH_MM && widthMm > A4_HEIGHT_MM) || (heightMm > A4_HEIGHT_MM && heightMm > A4_WIDTH_MM)) {
        return {
          ...baseRow,
          warning: `Credencial ${index + 1}: o tamanho informado não cabe em uma folha A4.`,
        };
      }

      const fit = getBestFitOnA4(widthMm, heightMm);
      if (!fit.itemsPerSheet) {
        return {
          ...baseRow,
          warning: `Credencial ${index + 1}: não foi possível encaixar essa medida em uma folha A4.`,
        };
      }

      const sheetsNeeded = Math.ceil(quantity / fit.itemsPerSheet);
      const impressionsNeeded = sheetsNeeded * sides;
      const pricingKey = getColorPaperPricingKey(material.paperType);
      const pricing = config.colorPrintPricing?.[pricingKey] || [];
      const sheetPrice = lookupTier(pricing, impressionsNeeded);
      const baseTotal = impressionsNeeded * sheetPrice;
      const laminationTotal = laminationSelected ? areaM2 * laminationPricePerM2 : 0;
      const rowDiscount = applyRowDiscount(row, baseTotal + laminationTotal + lanyardTotal + artCreationFee, quantity);

      return {
        ...baseRow,
        valid: true,
        itemsPerSheet: fit.itemsPerSheet,
        sheetsNeeded,
        impressionsNeeded,
        rotated: fit.rotated,
        sheetPrice,
        baseTotal,
        laminationTotal,
        lanyardTotal,
        artCreationFee,
        ...rowDiscount,
        tierLabel: `${fit.itemsPerSheet} por A4`,
      };
    }

    const pricing = config.m2Pricing?.[material.pricingKey] || [];
    const minimumBand = getCredentialMinimumBand(pricing);
    const tier = getM2PricingBand(pricing, areaM2);
    const pricePerM2 = toMoneyNumber(tier?.value);
    const minimumValue = toMoneyNumber(minimumBand?.value);
    const baseSubtotal = areaM2 * pricePerM2;
    let baseTotal = Math.max(minimumValue, baseSubtotal);

    if (printMode === "Frente e verso") {
      const flatCutPricing = config.m2Pricing?.flatCut || [];
      const flatCutBand = getM2PricingBand(flatCutPricing, areaM2);
      const flatCutPricePerM2 = toMoneyNumber(flatCutBand?.value);
      const flatCutSubtotal = areaM2 * flatCutPricePerM2;
      baseTotal += flatCutSubtotal;
    }

    const laminationTotal = laminationSelected ? areaM2 * laminationPricePerM2 : 0;
    const rowDiscount = applyRowDiscount(row, baseTotal + laminationTotal + lanyardTotal + artCreationFee, quantity);

    return {
      ...baseRow,
      valid: true,
      pricePerM2,
      baseTotal,
      laminationTotal,
      lanyardTotal,
      artCreationFee,
      ...rowDiscount,
      tierLabel: tier?.label || "-",
    };
  });

  rows.forEach((row) => {
    if (row.warning) {
      warnings.push(row.warning);
    }
  });

  const activeRows = rows.filter((row) => row.active && row.valid);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows,
    activeRows,
    warnings,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
  };
}

function calculateReadyProductWorkbook(state, config) {
  const rows = state.readyProductItems.map((row, index) => {
    const quantity = toWholeNumber(row.quantity);
    const active = isReadyProductRowActive(row);
    const product = getReadyProductSelection(config, row.productType, quantity);
    const description = (row.description || "").trim();
    const subtotal = product.totalPrice === null || product.totalPrice === undefined
      ? quantity * product.unitPrice
      : product.totalPrice;
    const artCreationFee = getArtCreationFee(row);
    const rowDiscount = applyRowDiscount(row, subtotal + artCreationFee, quantity);
    const packageWarning =
      active &&
      product.pricingMode === "printedBadge" &&
      quantity > 0 &&
      product.billedQuantity > quantity
        ? `Produto pronto ${index + 1}: cordão estampado vendido de 10 em 10. ${quantity} un foi calculado como ${product.billedQuantity} un.`
        : "";

    return {
      ...row,
      active,
      valid: active ? quantity > 0 : false,
      quantity,
      billedQuantity: product.billedQuantity || quantity,
      productType: product.label,
      productLabel: product.label,
      description: description || product.label,
      artCreationFee,
      unitPrice: product.totalPrice === null || product.totalPrice === undefined || quantity <= 0 ? product.unitPrice : subtotal / quantity,
      ...rowDiscount,
      warning: active && quantity <= 0 ? `Produto pronto ${index + 1}: informe uma quantidade maior que zero.` : packageWarning,
    };
  });

  const activeRows = rows.filter((row) => row.active && row.valid);
  const warnings = rows.filter((row) => row.warning).map((row) => row.warning);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows,
    activeRows,
    warnings,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
  };
}

function calculateBusinessCardWorkbook(state) {
  const rows = state.businessCardItems.map((row, index) => {
    const productionType = OPTIONS.businessCardProductions.includes(row.productionType) ? row.productionType : "Laser";
    const material = getBusinessCardMaterial(row.materialId, productionType);
    const printMode = getBusinessCardValidPrintMode(material, row.printMode);
    const quantity = toWholeNumber(row.quantity);
    const active = isBusinessCardRowActive(row);
    const tier = getBusinessCardTier(material, printMode, quantity);
    const baseTotal = active && quantity > 0 && tier ? toMoneyNumber(tier.total) : 0;
    const extraFinish = OPTIONS.businessCardExtraFinish.includes(row.extraFinish) ? row.extraFinish : "Sem acabamento adicional";
    const extraFinishTotal = active ? calculateBusinessCardExtraFinishTotal(quantity, extraFinish) : 0;
    const artCreationFee = getArtCreationFee(row);
    const rowDiscount = applyRowDiscount(row, baseTotal + extraFinishTotal + artCreationFee, quantity);
    const warning = active && quantity <= 0
      ? `Cartão ${index + 1}: escolha uma quantidade da tabela.`
      : active && !tier
        ? `Cartão ${index + 1}: escolha uma quantidade válida para essa combinação de papel e impressão.`
        : active && extraFinish === "Com acabamento adicional" && quantity < 100
          ? `Cartão ${index + 1}: acabamento adicional tem mínimo de 100 unidades.`
        : "";

    return {
      ...row,
      active,
      valid: active ? quantity > 0 && Boolean(tier) : false,
      productionType,
      materialId: material?.id || "",
      materialLabel: material?.label || "",
      printMode,
      quantity,
      extraFinish,
      packageQuantity: tier?.quantity || 0,
      packageLabel: tier ? `${formatInteger(tier.quantity)} cartões` : "-",
      baseTotal,
      extraFinishTotal,
      artCreationFee,
      ...rowDiscount,
      warning,
    };
  });

  const activeRows = rows.filter((row) => row.active && row.valid);
  const warnings = rows.filter((row) => row.warning).map((row) => row.warning);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows,
    activeRows,
    warnings,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
  };
}

function calculateFlyerWorkbook(state) {
  const rows = state.flyerItems.map((row, index) => {
    const productionType = OPTIONS.flyerProductions.includes(row.productionType) ? row.productionType : "Laser";
    const item = getFlyerSelection(row.catalogId, productionType);
    const printMode = getFlyerValidPrintMode(item, row.printMode);
    const quantity = toWholeNumber(row.quantity);
    const active = isFlyerRowActive(row);
    const tier = getFlyerTier(item, printMode, quantity);
    const baseTotal = active && tier ? toMoneyNumber(tier.total) : 0;
    const foldType = OPTIONS.flyerFolds.includes(row.foldType) ? row.foldType : "Sem dobra";
    const foldTotal = active ? calculateFlyerFoldTotal(quantity, foldType) : 0;
    const artCreationFee = getArtCreationFee(row);
    const rowDiscount = applyRowDiscount(row, baseTotal + foldTotal + artCreationFee, quantity);
    const warning = active && quantity <= 0
      ? `Panfleto ${index + 1}: escolha uma quantidade da tabela.`
      : active && !tier
        ? `Panfleto ${index + 1}: escolha uma quantidade válida para essa combinação.`
        : active && foldType !== "Sem dobra" && quantity < 100
          ? `Panfleto ${index + 1}: dobra tem mínimo de 100 unidades.`
          : "";

    return {
      ...row,
      active,
      valid: active ? quantity > 0 && Boolean(tier) : false,
      productionType,
      catalogId: item?.id || "",
      paper: item?.paper || "",
      size: item?.size || "",
      printMode,
      quantity,
      foldType,
      baseTotal,
      foldTotal,
      artCreationFee,
      ...rowDiscount,
      warning,
    };
  });

  const activeRows = rows.filter((row) => row.active && row.valid);
  const warnings = rows.filter((row) => row.warning).map((row) => row.warning);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows,
    activeRows,
    warnings,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
  };
}

function calculateWorkbook(state, config) {
  const rows = state.rows.map((row) => ({
    ...row,
    quantity: toWholeNumber(row.quantity),
    pages: toWholeNumber(row.pages),
    colorPages: toWholeNumber(row.colorPages),
  }));

    const rowBase = rows.map((row) => {
    const innerBreakdown = getInnerImpressionBreakdown(row);
    const bindingSheetsPerCopy = getBindingSheetsPerCopy(row);
    const coverImpressions = getCoverImpressions(row, "cover");
    const backImpressions = getCoverImpressions(row, "back");
    return { row, innerBreakdown, bindingSheetsPerCopy, coverImpressions, backImpressions };
  });

  const aggregateInnerByKey = {};
  const aggregateCoverByPaper = {};
  let aggregateColorPagesOnSulfite = 0;

  for (const item of rowBase) {
    const blackWhiteKey = getPrintAggregationKey("Preto e branco", item.row.printMode);
    if (item.innerBreakdown.blackWhiteImpressions > 0) {
      aggregateInnerByKey[blackWhiteKey] = (aggregateInnerByKey[blackWhiteKey] || 0) + item.innerBreakdown.blackWhiteImpressions;
    }

    if (item.innerBreakdown.colorImpressions > 0 && item.innerBreakdown.normalizedColorPages > 0) {
      aggregateColorPagesOnSulfite += item.innerBreakdown.colorImpressions;
    } else if (item.innerBreakdown.colorImpressions > 0 && item.row.printType !== "Preto e branco") {
      const colorKey = getPrintAggregationKey(item.row.printType, item.row.printMode);
      aggregateInnerByKey[colorKey] = (aggregateInnerByKey[colorKey] || 0) + item.innerBreakdown.colorImpressions;
    }

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

    if (mixedSpiral && finishingType === "Encadernação espiral") {
      warnings.push(`Grupo ${groupName}: existem opções de espiral diferentes. O app usou a opção da primeira linha do grupo.`);
    }

    if (quantitySet.length > 1) {
      warnings.push(`Grupo ${groupName}: as quantidades das linhas estão diferentes. O acabamento foi calculado usando a menor quantidade do grupo.`);
    }

    let finishingUnit = 0;
    let finishingTotal = 0;

    if (finishingType === "Encadernação espiral") {
      finishingUnit = getSpiralUnitPrice({ ...leader.row, quantity: groupQuantity }, sheetsPerCopy, config);
      finishingTotal = groupQuantity * finishingUnit;
      if (sheetsPerCopy > 500) {
        warnings.push(`Grupo ${groupName}: a espiral vai até 500 folhas por apostila. Ajuste esse grupo manualmente.`);
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
    const { row, innerBreakdown, bindingSheetsPerCopy, coverImpressions, backImpressions } = item;
    const effectiveBlackWhiteQty =
      state.calcMode === "Somar quantidades"
        ? aggregateInnerByKey[getPrintAggregationKey("Preto e branco", row.printMode)] || 0
        : innerBreakdown.blackWhiteImpressions;
    const effectiveColorQty =
      row.printType !== "Preto e branco" && innerBreakdown.normalizedColorPages === 0
        ? state.calcMode === "Somar quantidades"
          ? aggregateInnerByKey[getPrintAggregationKey(row.printType, row.printMode)] || 0
          : innerBreakdown.colorImpressions
        : 0;

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

    let innerTotal = 0;
    if (innerBreakdown.blackWhiteImpressions > 0) {
      innerTotal += getBlackWhiteTotal(innerBreakdown.blackWhiteImpressions, effectiveBlackWhiteQty, config, row.printMode);
    }
    if (innerBreakdown.colorImpressions > 0) {
      if (innerBreakdown.normalizedColorPages > 0) {
        const sulfitePricingQty = state.calcMode === "Somar quantidades"
          ? aggregateColorPagesOnSulfite
          : innerBreakdown.colorImpressions;
        const sulfiteUnit = lookupTier(config.coverPricing["Sulfite 75g"], sulfitePricingQty);
        innerTotal += innerBreakdown.colorImpressions * sulfiteUnit;
      } else {
        innerTotal += getPrintTotalByType(row.printType, innerBreakdown.colorImpressions, effectiveColorQty, config, row.printMode);
      }
    }
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
    } else if (row.finishing === "Encadernação espiral") {
      finishingUnit = getSpiralUnitPrice(row, bindingSheetsPerCopy, config);
      finishingTotal = row.quantity * finishingUnit;
      if (bindingSheetsPerCopy > 500 && isRowActive(row)) {
        warnings.push(`Item ${index + 1}: a espiral vai até 500 folhas por apostila. Ajuste esse item manualmente.`);
      }
    } else if (row.finishing === "Livreto") {
      finishingUnit = getBookletUnitPrice(row.quantity, config);
      finishingTotal = row.quantity * finishingUnit;
    }

    const artCreationFee = getArtCreationFee(row);
    const rowDiscount = applyRowDiscount(row, innerTotal + coverTotal + backTotal + finishingTotal + artCreationFee, row.quantity);

    if (row.colorPages > row.pages && isRowActive(row)) {
      warnings.push(`Item ${index + 1}: as páginas coloridas não podem ser maiores que o total de páginas. O app usou o limite da quantidade total.`);
    }

    return {
      ...row,
      active: isRowActive(row),
      innerImpressions: innerBreakdown.totalImpressions,
      blackWhiteImpressions: innerBreakdown.blackWhiteImpressions,
      colorImpressions: innerBreakdown.colorImpressions,
      colorPages: innerBreakdown.normalizedColorPages,
      blackWhitePages: innerBreakdown.blackWhitePagesPerCopy,
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
      artCreationFee,
      ...rowDiscount,
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
    const widthCm = toDecimalNumber(row.widthMm);
    const heightCm = toDecimalNumber(row.heightMm);
    const widthMm = widthCm * 10;
    const heightMm = heightCm * 10;
    const quantity = toWholeNumber(row.quantity);
    const hasBleed = row.bleedMode === "Com sangra";
    const effectiveWidth = widthMm + (hasBleed ? 2 : 0);
    const effectiveHeight = heightMm + (hasBleed ? 2 : 0);
    const active = isColorPrintRowActive(row);

    if ((effectiveWidth > A4_WIDTH_MM && effectiveWidth > A4_HEIGHT_MM) || (effectiveHeight > A4_HEIGHT_MM && effectiveHeight > A4_WIDTH_MM)) {
      if (active) {
        warnings.push(`Impresso ${index + 1}: o tamanho informado não cabe em uma folha A4.`);
      }
    }

    if (effectiveWidth <= 0 || effectiveHeight <= 0 || quantity <= 0) {
      return {
        ...row,
        widthMm: widthCm,
        heightMm: heightCm,
        effectiveWidth,
        effectiveHeight,
        active,
        itemsPerSheet: 0,
        a4Sheets: 0,
        a4Impressions: 0,
        printTotal: 0,
        suggestedCutPrice: 0,
        finalCutPrice: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        artCreationFee: getArtCreationFee(row),
        ...applyRowDiscount(row, (row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride)) + getArtCreationFee(row), quantity),
        estimatedCuts: 0,
      };
    }

    const fit = getBestFitOnA4(effectiveWidth, effectiveHeight);
    if (fit.itemsPerSheet <= 0) {
      if (active) {
        warnings.push(`Impresso ${index + 1}: o tamanho informado não cabe em uma folha A4.`);
      }
      return {
        ...row,
        widthMm: widthCm,
        heightMm: heightCm,
        effectiveWidth,
        effectiveHeight,
        active,
        itemsPerSheet: 0,
        a4Sheets: 0,
        a4Impressions: 0,
        printTotal: 0,
        suggestedCutPrice: 0,
        finalCutPrice: row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride),
        artCreationFee: getArtCreationFee(row),
        ...applyRowDiscount(row, (row.cutPriceOverride === "" ? 0 : toMoneyNumber(row.cutPriceOverride)) + getArtCreationFee(row), quantity),
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
    const artCreationFee = getArtCreationFee(row);
    const rowDiscount = applyRowDiscount(row, printTotal + finalCutPrice + artCreationFee, quantity);

    return {
      ...row,
      widthMm: widthCm,
      heightMm: heightCm,
      effectiveWidth,
      effectiveHeight,
      active,
      itemsPerSheet: fit.itemsPerSheet,
      a4Sheets,
      a4Impressions,
      printTotal,
      suggestedCutPrice,
      finalCutPrice,
      artCreationFee,
      ...rowDiscount,
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

function getM2Tier(productId, areaM2) {
  const product = M2_PRODUCTS.find((item) => item.id === productId) || M2_PRODUCTS[0];
  return product.tiers.find((tier) => areaM2 <= tier.maxArea) || product.tiers[product.tiers.length - 1];
}

function calculateM2Workbook(state) {
  const warnings = [];
  const rows = state.m2Items.map((row, index) => {
    const product = M2_PRODUCTS.find((item) => item.id === row.productId) || M2_PRODUCTS[0];
    const widthMm = toDecimalNumber(row.widthMm);
    const heightMm = toDecimalNumber(row.heightMm);
    const quantity = toWholeNumber(row.quantity);
    const unitAreaM2 = widthMm > 0 && heightMm > 0 ? (widthMm * heightMm) / 1000000 : 0;
    const unitEffectiveArea = row.includeBleed ? ((widthMm + 4) * (heightMm + 4)) / 1000000 : unitAreaM2;
    const areaM2 = unitAreaM2 * quantity;
    const effectiveArea = unitEffectiveArea * quantity;
    const tier = getM2Tier(product.id, effectiveArea);
    const extraCharge = toMoneyNumber(typeof row.extraCharge !== "undefined" ? row.extraCharge : row.finishingExtra);
    const artCreationFee = toMoneyNumber(row.artCreationFee);
    const fixedCharges = extraCharge + artCreationFee;
    const tierValue = Number(tier?.value || 0);
    const subtotal = effectiveArea * tierValue;
    const unitValue = quantity > 0 ? subtotal / quantity : 0;
    const total = subtotal + fixedCharges;
    const active = widthMm > 0 && heightMm > 0 && quantity > 0;

    if (active && effectiveArea <= 0) {
      warnings.push(`Item m² ${index + 1}: informe largura e altura válidas.`);
    }

    return {
      ...row,
      productLabel: product.label,
      material: product.material,
      print: product.print,
      finishingLabel: product.finishing,
      widthMm,
      heightMm,
      quantity,
      areaM2,
      effectiveArea,
      tierLabel: tier?.maxArea === Infinity ? "acima do intervalo" : `até ${tier.maxArea} m²`,
      tierValue,
      configuredFinishExtra: 0,
      configuredFinishExtraTotal: 0,
      extraCharge,
      artCreationFee,
      fixedCharges,
      unitValue,
      subtotal,
      total,
      active,
    };
  });

  const activeRows = rows.filter((row) => row.active);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows,
    activeRows,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
    warnings,
  };
}

function getM2MinimumValue(pricing) {
  const minimumRow = Array.isArray(pricing)
    ? pricing.find((tier) => String(tier.label || "").toLowerCase().includes("valor minimo"))
    : null;
  return Number(minimumRow?.value || 30);
}

function getM2PricingBand(pricing, areaM2) {
  if (!Array.isArray(pricing) || pricing.length === 0) {
    return null;
  }

  const bands = pricing.filter((tier) => !String(tier.label || "").toLowerCase().includes("valor minimo"));
  return bands.find((tier) => areaM2 <= Number(tier.min || 0)) || bands[bands.length - 1] || null;
}

function calculateM2WorkbookFromConfig(state, config) {
  const warnings = [];
  const catalog = getM2Catalog(config);
  const baseRows = state.m2Items.map((row, index) => {
    const product = catalog.find((item) => item.id === row.productId) || catalog[0];
    const pricing = config.m2Pricing?.[product.pricingKey || product.configKey] || [];
    const measureFactor = row.measureUnit === "m" ? 1000 : 10;
    const widthInput = toDecimalNumber(row.widthMm);
    const heightInput = toDecimalNumber(row.heightMm);
    const widthMm = widthInput * measureFactor;
    const heightMm = heightInput * measureFactor;
    const bleedMm = Number(product.bleedMm || 0);
    const pricingWidthMm = widthMm + bleedMm;
    const pricingHeightMm = heightMm + bleedMm;
    const quantity = toWholeNumber(row.quantity);
    const unitDisplayAreaM2 = widthMm > 0 && heightMm > 0 ? (widthMm * heightMm) / 1000000 : 0;
    const unitPricingAreaM2 = pricingWidthMm > 0 && pricingHeightMm > 0 ? (pricingWidthMm * pricingHeightMm) / 1000000 : 0;
    const displayAreaM2 = unitDisplayAreaM2 * quantity;
    const areaM2 = unitPricingAreaM2 * quantity;
    const tier = getM2PricingBand(pricing, areaM2);
    const pricePerM2 = Number(tier?.value || 0);
    const configuredFinishExtra = calculateM2FinishExtra(row, product, config);
    const configuredFinishExtraTotal = configuredFinishExtra * quantity;
    const extraCharge = toMoneyNumber(typeof row.extraCharge !== "undefined" ? row.extraCharge : row.finishingExtra);
    const artCreationFee = toMoneyNumber(row.artCreationFee);
    const fixedCharges = extraCharge + artCreationFee;
    const finishingExtra = configuredFinishExtra;
    const subtotal = (areaM2 * pricePerM2) + configuredFinishExtraTotal;
    const unitValue = quantity > 0 ? subtotal / quantity : 0;
    const total = subtotal + fixedCharges;
    const active = widthMm > 0 && heightMm > 0 && quantity > 0;

    if (active && areaM2 <= 0) {
      warnings.push(`Item m² ${index + 1}: informe largura e altura válidas.`);
    }

    return {
      ...row,
      productLabel: product.label,
      finishIds: Array.isArray(row.finishIds) ? row.finishIds : [],
      finishSummary: getM2FinishSummary(row, config).join(" | "),
      widthMm: widthInput,
      heightMm: heightInput,
      quantity,
      areaM2: displayAreaM2,
      effectiveArea: areaM2,
      tierLabel: tier?.label || "",
      tierValue: pricePerM2,
      configuredFinishExtra,
      configuredFinishExtraTotal,
      extraCharge,
      artCreationFee,
      fixedCharges,
      finishingExtra,
      unitValue,
      subtotal,
      total,
      active,
    };
  });

  const shouldGroupSameMaterials = state.m2CalcMode === "Somar materiais iguais";
  const pricingAreaByProduct = {};
  for (const row of baseRows) {
    if (!row.active) continue;
    pricingAreaByProduct[row.productId] = (pricingAreaByProduct[row.productId] || 0) + row.effectiveArea;
  }

  const rows = baseRows.map((row) => {
    if (!row.active) {
      return row;
    }

    const catalogProduct = catalog.find((item) => item.id === row.productId) || catalog[0];
    const pricing = config.m2Pricing?.[catalogProduct.pricingKey || catalogProduct.configKey] || [];
    const pricingArea = shouldGroupSameMaterials ? pricingAreaByProduct[row.productId] || row.effectiveArea : row.effectiveArea;
    const tier = getM2PricingBand(pricing, pricingArea);
    const pricePerM2 = Number(tier?.value || 0);
    const subtotal = (row.effectiveArea * pricePerM2) + row.configuredFinishExtraTotal;
    const unitValue = row.quantity > 0 ? subtotal / row.quantity : 0;
    const total = subtotal + row.fixedCharges;

    return {
      ...row,
      tierLabel: tier?.label || "",
      tierValue: pricePerM2,
      subtotal,
      unitValue,
      total,
      groupedPricingArea: pricingArea,
    };
  });

  const totalsByProduct = {};
  const baseTotalsByProduct = {};
  const fixedTotalsByProduct = {};
  for (const row of rows) {
    if (!row.active) continue;
    if (shouldGroupSameMaterials) {
      totalsByProduct[row.productId] = (totalsByProduct[row.productId] || 0) + row.total;
      baseTotalsByProduct[row.productId] = (baseTotalsByProduct[row.productId] || 0) + row.subtotal;
      fixedTotalsByProduct[row.productId] = (fixedTotalsByProduct[row.productId] || 0) + row.fixedCharges;
    }
  }

  const firstActiveIndexByProduct = {};
  rows.forEach((row, index) => {
    if (shouldGroupSameMaterials && row.active && typeof firstActiveIndexByProduct[row.productId] === "undefined") {
      firstActiveIndexByProduct[row.productId] = index;
    }
  });

  const rowsWithMinimum = rows.map((row, index) => {
    const product = M2_CATALOG.find((item) => item.id === row.productId) || M2_CATALOG[0];
    const minimumValue = getM2MinimumValue(config.m2Pricing?.[product.pricingKey || product.configKey] || []);

    if (!shouldGroupSameMaterials) {
      const minimumApplied = row.active && row.subtotal > 0 && row.subtotal < minimumValue;
      const adjustedBase = minimumApplied ? minimumValue : row.subtotal;
      return {
        ...row,
        total: row.active ? adjustedBase + row.fixedCharges : 0,
        groupTotal: row.total,
        groupBaseTotal: row.subtotal,
        groupFixedTotal: row.fixedCharges,
        minimumTotal: adjustedBase + row.fixedCharges,
        minimumApplied,
      };
    }

    const groupTotal = totalsByProduct[row.productId] || 0;
    const groupBaseTotal = baseTotalsByProduct[row.productId] || 0;
    const groupFixedTotal = fixedTotalsByProduct[row.productId] || 0;
    const minimumApplied = groupBaseTotal > 0 && groupBaseTotal < minimumValue;
    const adjustedGroupBaseTotal = minimumApplied ? minimumValue : groupBaseTotal;
    const displayTotal = row.active
      ? minimumApplied
        ? firstActiveIndexByProduct[row.productId] === index
          ? adjustedGroupBaseTotal + row.fixedCharges
          : row.fixedCharges
        : row.total
      : 0;

    return {
      ...row,
      total: displayTotal,
      groupTotal,
      groupBaseTotal,
      groupFixedTotal,
      minimumTotal: adjustedGroupBaseTotal + groupFixedTotal,
      minimumApplied: row.active && minimumApplied,
    };
  });

  const discountedRows = rowsWithMinimum.map((row) => ({
    ...row,
    ...applyRowDiscount(row, row.active ? row.total : 0, row.quantity),
  }));

  const activeRows = discountedRows.filter((row) => row.active);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);

  return {
    rows: discountedRows,
    activeRows,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
    warnings,
  };
}

function buildOptions(options, currentValue) {
  return options
    .map((option) => `<option value="${escapeHtml(option)}"${option === currentValue ? " selected" : ""}>${escapeHtml(option)}</option>`)
    .join("");
}

function buildReadyProductOptions(currentValue) {
  const grouped = READY_PRODUCT_CATALOG.reduce((accumulator, item) => {
    if (!accumulator[item.category]) {
      accumulator[item.category] = [];
    }
    accumulator[item.category].push(item);
    return accumulator;
  }, {});

  return Object.entries(grouped)
    .map(
      ([category, items]) => `
        <optgroup label="${escapeHtml(category)}">
          ${items
            .map(
              (item) =>
                `<option value="${escapeHtml(item.id)}"${item.id === currentValue ? " selected" : ""}>${escapeHtml(item.label)}</option>`
            )
            .join("")}
        </optgroup>
      `
    )
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

function ensureCredentialRowCount(state, minimumCount) {
  while (state.credentialItems.length < minimumCount) {
    state.credentialItems.push(createDefaultCredentialRow(state.credentialItems.length));
  }
}

function ensureReadyProductRowCount(state, minimumCount) {
  while (state.readyProductItems.length < minimumCount) {
    state.readyProductItems.push(createDefaultReadyProductRow(state.readyProductItems.length));
  }
}

function ensureM2RowCount(state, minimumCount) {
  while (state.m2Items.length < minimumCount) {
    state.m2Items.push(createDefaultM2Row(state.m2Items.length));
  }
}

function ensureResinRowCount(state, minimumCount) {
  while (state.resinItems.length < minimumCount) {
    state.resinItems.push(createDefaultResinRow(state.resinItems.length));
  }
}

function ensureBusinessCardRowCount(state, minimumCount) {
  if (!Array.isArray(state.businessCardItems)) {
    state.businessCardItems = [];
  }
  while (state.businessCardItems.length < minimumCount) {
    state.businessCardItems.push(createDefaultBusinessCardRow(state.businessCardItems.length));
  }
}

function ensureFlyerRowCount(state, minimumCount) {
  if (!Array.isArray(state.flyerItems)) {
    state.flyerItems = [];
  }
  while (state.flyerItems.length < minimumCount) {
    state.flyerItems.push(createDefaultFlyerRow(state.flyerItems.length));
  }
}

function trimEmptyRows(rows, minimumCount, isActive) {
  const trimmed = [...rows];
  while (trimmed.length > minimumCount && !isActive(trimmed[trimmed.length - 1])) {
    trimmed.pop();
  }
  return trimmed;
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

function createConfigSectionTabsMarkup(activeSection = "calculo") {
  const sections = [
    { id: "calculo", label: "Cálculo de apostila", helper: "Impressão, capas e acabamentos." },
    { id: "impressos", label: "Impressos coloridos", helper: "Papéis, cortes e produtos extras." },
    { id: "credenciais", label: "Credenciais", helper: "Materiais, laminação e cordões." },
    { id: "produtos-prontos", label: "Produtos prontos", helper: "Cordões e itens vendidos separadamente." },
    { id: "cartoes", label: "Cartões de visitas", helper: "Tabela laser e offset para cartões." },
    { id: "panfletos", label: "Panfletos e folders", helper: "Tabela laser e offset para panfletos." },
    { id: "m2", label: "Cálculo de m²", helper: "Faixas, acabamentos e produtos por área." },
    { id: "resinados", label: "Resinados", helper: "Tabela A3, margem de resina e valor mínimo." },
  ];

  return `
    <div class="config-section-tabs" role="tablist" aria-label="Seções da configuração">
      ${sections
        .map(
          (section) => `
            <button
              class="button config-section-tab${activeSection === section.id ? " is-active" : ""}"
              type="button"
              role="tab"
              aria-selected="${activeSection === section.id ? "true" : "false"}"
              data-config-section="${escapeHtml(section.id)}"
            >
              <span>${escapeHtml(section.label)}</span>
              <small>${escapeHtml(section.helper)}</small>
            </button>
          `
        )
        .join("")}
    </div>
  `;
}

function createConfigSectionsMarkup(config, viewMode = "basic", activeSection = "calculo") {
  const apostilaCards = [
    createConfigCardMarkup(
      "Preços de impressão",
      "Esses valores alimentam a aba de cálculo de apostila.",
      [
        createInlineConfigBlockMarkup(
          "Preto e branco",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Modo"],
            config.printPricing.blackWhite,
            "bw",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "mode", type: "text" },
            ]
          ),
          "Os dois primeiros valores continuam como total fixo. As faixas de 1000 e 10000 valem apenas para frente e verso; no só frente, acima de 100 continua na mesma faixa."
        ),
        createInlineConfigBlockMarkup(
          "Colorido jato de tinta",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.printPricing.inkjet,
            "inkjet",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Colorido laser",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.printPricing.laser,
            "laser",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
      ].join("")
    ),
    createConfigCardMarkup(
      "Capas e contracapas",
      "Separei por papel para ficar mais fácil localizar o preço certo.",
      OPTIONS.coverPapers
        .map((paper) =>
          createInlineConfigBlockMarkup(
            paper,
            createTableMarkup(
              ["Qtd mínima", "Valor", "Faixa"],
              config.coverPricing[paper],
              `cover-${paper}`,
              [
                { key: "min", type: "number", step: "1" },
                { key: "value", type: "number", step: "0.01" },
                { key: "label", type: "text" },
              ]
            )
          )
        )
        .join("")
    ),
    createConfigCardMarkup(
      "Encadernação e livreto",
      "Ajuste aqui os valores de acabamento usados na apostila.",
      [
        createInlineConfigBlockMarkup(
          "Encadernação espiral",
          createSpiralTableMarkup(config.spiralPricing),
          "Valores por unidade de apostila, conforme faixa de folhas e quantidade de exemplares."
        ),
        createInlineConfigBlockMarkup(
          "Livreto",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.bookletPricing,
            "booklet",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
      ].join("")
    ),
    createCatalogTabCardMarkup("calculo", "Produtos extras desta aba", config.catalogSections, config, viewMode),
  ];

  const impressosCards = [
    createConfigCardMarkup(
      "Preços por papel",
      "Esses valores são usados na aba de impressos coloridos.",
      [
        createInlineConfigBlockMarkup(
          "Sulfite 75g",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["Sulfite 75g"],
            "color-Sulfite 75g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Offset 120g",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["Offset 120g"],
            "color-Offset 120g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Couche 170 / Offset 170 / Reciclato 170",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["170g"],
            "color-170g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Couche 250 / Offset 240 / Reciclato 240",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["250g"],
            "color-250g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Couche 300 / Metalizados",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["300g"],
            "color-300g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
      ].join("")
    ),
    createConfigCardMarkup(
      "Cordões e produtos prontos",
      "Configure aqui os cordões usados na credencial e os itens vendidos separadamente na aba de produtos prontos.",
      createCredentialLanyardPricingMarkup(config.credentialLanyardPricing)
    ),
    createConfigCardMarkup(
      "Tabela de cortes",
      "Até 5 folhas usa valor fixo por faixa. Acima de 5 folhas usa valor por corte.",
      createColorCutTableMarkup(config.cutPricing)
    ),
    createCatalogTabCardMarkup("impressos", "Produtos extras desta aba", config.catalogSections, config, viewMode),
  ];

  const m2Cards = [
    createConfigCardMarkup(
      "Faixas de preço do m²",
      "Cada produto abaixo usa suas próprias faixas na aba de cálculo de m².",
      createM2PricingMarkup(config.m2Pricing)
    ),
    createConfigCardMarkup(
      "Acabamentos do m²",
      "Configure aqui os opcionais que aparecem no menu flutuante da aba de m².",
      createM2FinishesMarkup(config.m2Finishes)
    ),
    createCatalogTabCardMarkup("m2", "Produtos extras desta aba", config.catalogSections, config, viewMode),
  ];

  const credenciaisCards = [
    createConfigCardMarkup(
      "Papéis da credencial",
      "Esses valores abastecem os papéis usados na aba de credenciais. Para PS 1mm e PS 2mm, o sistema continua puxando as faixas do cálculo de m².",
      [
        createInlineConfigBlockMarkup(
          "Couche 250 / Offset 240 / Reciclato 240",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["250g"],
            "credential-color-250g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
        createInlineConfigBlockMarkup(
          "Couche 300 / Metalizados",
          createTableMarkup(
            ["Qtd mínima", "Valor", "Faixa"],
            config.colorPrintPricing["300g"],
            "credential-color-300g",
            [
              { key: "min", type: "number", step: "1" },
              { key: "value", type: "number", step: "0.01" },
              { key: "label", type: "text" },
            ]
          )
        ),
      ].join("")
    ),
    createConfigCardMarkup(
      "PS da credencial",
      "Essas faixas controlam o cálculo das credenciais em PS 1mm e PS 2mm.",
      createCredentialPsPricingMarkup(config.m2Pricing)
    ),
    createConfigCardMarkup(
      "Laminação da credencial",
      "Ajuste aqui o valor da laminação aplicado nas credenciais.",
      createCredentialLaminationConfigMarkup(config.m2Finishes)
    ),
    createConfigCardMarkup(
      "Cordão da credencial",
      "Na aba de credenciais, deixe só o modelo roliço configurado aqui.",
      createCredentialRoundLanyardPricingMarkup(config.credentialLanyardPricing)
    ),
  ];

  const produtosProntosCards = [
    createConfigCardMarkup(
      "Cordões e produtos vendidos separadamente",
      "Esses valores aparecem na aba de produtos prontos para orçar itens avulsos. Os cordões seguem a configuração abaixo e os carimbos usam a tabela fixa cadastrada no sistema.",
      createCredentialLanyardPricingMarkup(config.credentialLanyardPricing)
    ),
  ];

  const resinadosCards = [
    createConfigCardMarkup(
      "Tabela de resinados",
      "Configure aqui o valor mínimo, a margem extra e o custo por folha A3 dos adesivos resinados.",
      createResinConfigMarkup(config.resinPricing)
    ),
  ];

  const cartoesCards = [
    createConfigCardMarkup(
      "Tabela de cartões",
      "Inclui produção laser e offset, com opções de só frente e frente e verso conforme a tabela enviada.",
      `<p class="helper-text">Use a aba Cartões de visitas para selecionar produção, papel/acabamento, impressão e somente uma das quantidades cadastradas na tabela.</p>`
    ),
  ];

  const safeSection = activeSection === "impressos" || activeSection === "credenciais" || activeSection === "produtos-prontos" || activeSection === "cartoes" || activeSection === "panfletos" || activeSection === "m2" || activeSection === "resinados" ? activeSection : "calculo";
  const configGroups = {
    calculo: createConfigGroupMarkup(
      "calculo",
      "Aba: Cálculo de apostila",
      "Tudo o que aparece aqui afeta somente a aba de apostilas.",
      apostilaCards
    ),
    impressos: createConfigGroupMarkup(
      "impressos",
      "Aba: Impressos coloridos",
      "Use este bloco para ajustar preços, cortes e produtos extras dos impressos coloridos.",
      impressosCards
    ),
    credenciais: createConfigGroupMarkup(
      "credenciais",
      "Aba: Credenciais",
      "Use este bloco para ajustar materiais, laminação e cordões da aba de credenciais.",
      credenciaisCards
    ),
    "produtos-prontos": createConfigGroupMarkup(
      "produtos-prontos",
      "Aba: Produtos prontos",
      "Aqui ficam os valores dos cordões e itens vendidos separadamente na aba de produtos prontos.",
      produtosProntosCards
    ),
    cartoes: createConfigGroupMarkup(
      "cartoes",
      "Aba: Cartões de visitas",
      "Tabela de cartões laser e offset usada na aba de cartões de visitas.",
      cartoesCards
    ),
    panfletos: createConfigGroupMarkup(
      "panfletos",
      "Aba: Panfletos e folders",
      "Tabela fixa de panfletos e folders laser/offset cadastrada no sistema.",
      [
        createConfigCardMarkup(
          "Tabela de panfletos e folders",
          "Inclui papéis, tamanhos, impressão só frente/frente e verso e adicional de dobra.",
          `<p class="helper-text">A aba Panfletos e folders usa somente as quantidades cadastradas na tabela enviada.</p>`
        ),
      ]
    ),
    m2: createConfigGroupMarkup(
      "m2",
      "Aba: Cálculo de m²",
      "Aqui ficam as faixas de preço, acabamentos e produtos extras do cálculo por área.",
      m2Cards
    ),
    resinados: createConfigGroupMarkup(
      "resinados",
      "Aba: Resinados",
      "Ajuste aqui a tabela A3 usada no cálculo de adesivos resinados.",
      resinadosCards
    ),
  };

  return [
    `
      <article class="config-overview config-overview-hero">
        <div class="config-hero-copy">
          <span class="config-kicker">Central inteligente de preços</span>
          <h3>Organize tudo com visual mais simples e pronto para venda</h3>
          <p class="helper-text">Primeiro escolha a aba que deseja editar. Depois ajuste preços, acabamentos ou produtos extras somente daquele bloco.</p>
          <div class="config-tip-grid">
            <article class="config-tip-card">
              <span class="config-tip-icon">P</span>
              <div>
                <strong>Preços</strong>
                <p>Atualize faixas e valores sem procurar em várias telas.</p>
              </div>
            </article>
            <article class="config-tip-card">
              <span class="config-tip-icon">A</span>
              <div>
                <strong>Acabamentos</strong>
                <p>Deixe ilhós, laminação e demais extras prontos para uso.</p>
              </div>
            </article>
            <article class="config-tip-card">
              <span class="config-tip-icon">D</span>
              <div>
                <strong>Dicas</strong>
                <p>Use o modo iniciante para o essencial e o avançado para os detalhes técnicos.</p>
              </div>
            </article>
          </div>
        </div>
        <div class="config-overview-toolbar">
          <div class="config-view-switch" role="group" aria-label="Modo da configuração">
            <button class="button button-small${viewMode === "basic" ? " is-active" : ""}" type="button" data-config-view-mode="basic">Modo iniciante</button>
            <button class="button button-small${viewMode === "advanced" ? " is-active" : ""}" type="button" data-config-view-mode="advanced">Modo avançado</button>
          </div>
          ${createConfigSectionTabsMarkup(safeSection)}
        </div>
      </article>
    `,
    configGroups[safeSection],
  ].join("");
}

function createConfigLockedMarkup() {
  return `
    <article class="config-lock-card">
      <span class="config-lock-badge">Área protegida</span>
      <h3>Configuração bloqueada</h3>
      <p>
        Digite a senha para liberar preços, cortes, acabamentos e produtos extras nesta sessão.
      </p>
      <form id="config-lock-form" class="config-lock-form">
        <label>
          <span>Senha de acesso</span>
          <input
            id="config-password-input"
            type="password"
            autocomplete="current-password"
            placeholder="Digite a senha"
          >
        </label>
        <div class="toolbar">
          <button class="button button-primary" type="submit">Desbloquear configuração</button>
        </div>
      </form>
      <p class="helper-text">
        Essa trava ajuda a evitar alterações sem permissão nos computadores da equipe.
      </p>
    </article>
  `;
}

function createConfigCardMarkup(title, copy, innerMarkup) {
  return `
    <article class="config-card">
      <div class="config-card-meta">
        <span class="config-card-tag">Configuração</span>
        <span class="config-card-tag subtle">Base compartilhada</span>
      </div>
      <h3>${escapeHtml(title)}</h3>
      ${copy ? `<p class="helper-text">${escapeHtml(copy)}</p>` : ""}
      ${innerMarkup}
    </article>
  `;
}

function createConfigDeleteButtonMarkup(type, payload, disabled = false) {
  const attributes = Object.entries(payload)
    .map(([key, value]) => `data-${key}="${escapeHtml(String(value))}"`)
    .join(" ");
  return `
    <button class="button button-small button-danger config-delete-button" type="button" title="Excluir este item" data-config-delete="${escapeHtml(type)}"${disabled ? " disabled" : ""} ${attributes}>
      Excluir
    </button>
  `;
}

function createInlineConfigBlockMarkup(title, innerMarkup, copy = "") {
  return `
    <section class="config-subblock">
      <h4>${escapeHtml(title)}</h4>
      ${copy ? `<p class="helper-text">${escapeHtml(copy)}</p>` : ""}
      ${innerMarkup}
    </section>
  `;
}

function createConfigGroupMarkup(id, title, copy, cards) {
  return `
    <section class="config-group" id="config-group-${escapeHtml(id)}">
      <div class="config-group-heading">
        <span class="config-group-kicker">Área de configuração</span>
        <h3>${escapeHtml(title)}</h3>
        <p class="helper-text">${escapeHtml(copy)}</p>
      </div>
      <div class="config-card-grid">
        ${cards.join("")}
      </div>
    </section>
  `;
}

function createTableMarkup(headers, rows, prefix, fields) {
  const head = [...headers, "Ações"].map((header) => `<th>${escapeHtml(header)}</th>`).join("");
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
      const deleteButton = createConfigDeleteButtonMarkup(
        "config-row",
        {
          "config-prefix": prefix,
          "config-row": rowIndex,
        },
        rows.length <= 1
      );
      return `<tr>${cells}<td class="config-action-cell">${deleteButton}</td></tr>`;
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
            <th>Folhas até</th>
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
            <th>Mínimo por folha</th>
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

function createResinConfigMarkup(resinPricing) {
  return [
    `
      <div class="config-grid compact-grid">
        <label>
          <span>Valor mínimo do pedido (R$)</span>
          <input data-config-prefix="resin" data-config-row="0" data-config-key="minimumOrderPrice" type="number" step="0.01" value="${escapeHtml(resinPricing.minimumOrderPrice)}">
        </label>
        <label>
          <span>Margem extra (%)</span>
          <input data-config-prefix="resin" data-config-row="0" data-config-key="markupPercent" type="number" step="0.01" value="${escapeHtml(resinPricing.markupPercent)}">
        </label>
      </div>
    `,
    createInlineConfigBlockMarkup(
      "Vinil branco e transparente",
      `
        <div class="preset-grid">
          <label>
            <span>1 folha A3</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="standard-tier1" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.standard.tier1)}">
          </label>
          <label>
            <span>2 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="standard-tier2" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.standard.tier2)}">
          </label>
          <label>
            <span>5 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="standard-tier5" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.standard.tier5)}">
          </label>
          <label>
            <span>10 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="standard-tier10" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.standard.tier10)}">
          </label>
        </div>
      `,
      "Tabela usada para adesivo branco e transparente."
    ),
    createInlineConfigBlockMarkup(
      "Vinil especial",
      `
        <div class="preset-grid">
          <label>
            <span>1 folha A3</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="special-tier1" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.special.tier1)}">
          </label>
          <label>
            <span>2 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="special-tier2" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.special.tier2)}">
          </label>
          <label>
            <span>5 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="special-tier5" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.special.tier5)}">
          </label>
          <label>
            <span>10 folhas A3 (unidade)</span>
            <input data-config-prefix="resin" data-config-row="0" data-config-key="special-tier10" type="number" step="0.01" value="${escapeHtml(resinPricing.pricingByMaterial.special.tier10)}">
          </label>
        </div>
      `,
      "Tabela usada para holográficos e outros materiais especiais."
    ),
  ].join("");
}

function createCredentialLanyardPricingMarkup(credentialLanyardPricing) {
  const pricing = credentialLanyardPricing || {};
  return [
    createInlineConfigBlockMarkup(
      "Cordões fixos",
      `
        <div class="config-grid compact-grid">
          <label>
            <span>Cordão roliço branco 2mm (R$ / un)</span>
            <input data-config-prefix="credential-lanyard-fixed" data-config-row="0" data-config-key="roundWhite2mm" type="number" step="0.01" value="${escapeHtml(pricing.roundWhite2mm)}">
          </label>
          <label>
            <span>Cordão de crachá liso (R$ / un)</span>
            <input data-config-prefix="credential-lanyard-fixed" data-config-row="0" data-config-key="plainBadge" type="number" step="0.01" value="${escapeHtml(pricing.plainBadge)}">
          </label>
        </div>
      `,
      "Use estes campos para os modelos com valor fixo por unidade."
    ),
    createInlineConfigBlockMarkup(
      "Cordão estampado 20mm",
      `
        <div class="preset-card-head">
          <div>
            <strong>Pacotes de venda</strong>
            <span class="helper-text">A mesma tabela vale para jacaré e mosquetão. O cálculo sempre fecha no próximo múltiplo de 10.</span>
          </div>
          <div class="toolbar">
            <button class="button button-small" type="button" data-add-credential-lanyard-band>Adicionar pacote</button>
          </div>
        </div>
        ${createTableMarkup(
          ["Quantidade", "Valor total", "Pacote"],
          pricing.printedPackages || [],
          "credential-lanyard-printed-package",
          [
            { key: "quantity", type: "number", step: "10" },
            { key: "total", type: "number", step: "0.01" },
            { key: "label", type: "text" },
          ]
        )}
      `,
      "Esses pacotes são usados na aba de produtos prontos quando o cordão estampado for vendido avulso."
    ),
  ].join("");
}

function createCredentialRoundLanyardPricingMarkup(credentialLanyardPricing) {
  const pricing = credentialLanyardPricing || {};
  return createInlineConfigBlockMarkup(
    "Cordão da credencial",
    `
      <div class="config-grid compact-grid">
        <label>
          <span>Cordão roliço branco 2mm (R$ / un)</span>
          <input data-config-prefix="credential-lanyard-fixed" data-config-row="0" data-config-key="roundWhite2mm" type="number" step="0.01" value="${escapeHtml(pricing.roundWhite2mm)}">
        </label>
      </div>
    `,
    "Este é o cordão usado diretamente na aba de credenciais."
  );
}

function createCredentialPsPricingMarkup(m2Pricing) {
  const products = [
    { key: "ps1mm", label: "PS 1mm" },
    { key: "ps2mm", label: "PS 2mm" },
  ];

  return products
    .map((product) =>
      createInlineConfigBlockMarkup(
        product.label,
        createTableMarkup(
          ["Limite da faixa", "Valor", "Faixa"],
          m2Pricing?.[product.key] || [],
          `credential-${product.key}`,
          [
            { key: "min", type: "number", step: "0.01" },
            { key: "value", type: "number", step: "0.01" },
            { key: "label", type: "text" },
          ]
        ),
        "Essas faixas abastecem o cálculo de credenciais em PS."
      )
    )
    .join("");
}

function createCredentialLaminationConfigMarkup(m2Finishes) {
  const finishes = Array.isArray(m2Finishes) ? m2Finishes : [];
  const laminationIndex = finishes.findIndex((finish) =>
    String(finish?.id || "").toLowerCase() === "laminacao"
    || String(finish?.label || "").trim().toLowerCase() === "laminação".toLowerCase()
    || String(finish?.label || "").trim().toLowerCase() === "laminacao"
  );

  if (laminationIndex === -1) {
    return `<p class="helper-text">A laminação não foi localizada na base atual.</p>`;
  }

  const lamination = finishes[laminationIndex];
  return createInlineConfigBlockMarkup(
    "Laminação",
    `
      <div class="config-grid compact-grid">
        <label>
          <span>Valor da laminação (R$ por m²)</span>
          <input data-config-prefix="m2-finish" data-config-row="${laminationIndex}" data-config-key="price" type="number" step="0.01" value="${escapeHtml(lamination.price)}">
        </label>
      </div>
    `,
    "Esse valor é usado quando a credencial for calculada com laminação."
  );
}

function createM2PricingMarkup(m2Pricing) {
  const rows = M2_CATALOG.map((product) => {
    const bands = m2Pricing?.[product.configKey] || [];
    return `
      <section class="m2-config-block">
        <div class="m2-config-heading">
          <h4>${escapeHtml(product.label)}</h4>
          <button class="button button-small" type="button" data-add-m2-pricing="${escapeHtml(product.configKey)}">Adicionar faixa</button>
        </div>
        ${createTableMarkup(
          ["Limite da faixa", "Valor", "Faixa"],
          bands,
          `m2-${product.configKey}`,
          [
            { key: "min", type: "number", step: "0.01" },
            { key: "value", type: "number", step: "0.01" },
            { key: "label", type: "text" },
          ]
        )}
      </section>
    `;
  }).join("");

  return `<div class="m2-config-list">${rows}</div>`;
}

function createM2FinishesMarkup(m2Finishes) {
  const rows = (m2Finishes || [])
    .map(
      (finish, rowIndex) => `
        <tr>
          <td><input data-config-prefix="m2-finish" data-config-row="${rowIndex}" data-config-key="label" type="text" value="${escapeHtml(finish.label || "")}"></td>
          <td>
            <select data-config-prefix="m2-finish" data-config-row="${rowIndex}" data-config-key="type">
              <option value="eyelet"${finish.type === "eyelet" ? " selected" : ""}>Ilhós por unidade</option>
              <option value="perimeter"${finish.type === "perimeter" ? " selected" : ""}>Perímetro</option>
              <option value="area"${finish.type === "area" ? " selected" : ""}>Área em m²</option>
            </select>
          </td>
          <td><input data-config-prefix="m2-finish" data-config-row="${rowIndex}" data-config-key="price" type="number" step="0.01" value="${escapeHtml(finish.price)}"></td>
          <td><input data-config-prefix="m2-finish" data-config-row="${rowIndex}" data-config-key="spacingCm" type="number" step="1" value="${escapeHtml(finish.spacingCm ?? "")}"></td>
          <td class="config-action-cell">
            ${createConfigDeleteButtonMarkup(
              "m2-finish",
              { "finish-row": rowIndex },
              (m2Finishes || []).length <= 1
            )}
          </td>
        </tr>
      `
    )
    .join("");

  return `
    <div class="config-grid">
      <button class="button button-primary" type="button" data-add-m2-finish="1">Adicionar acabamento</button>
    </div>
    <p class="helper-text">Use "Ilhós por unidade" para acabamentos baseados na quantidade de ilhós. Nos demais, o espaçamento pode ficar vazio.</p>
    <div class="table-shell">
      <table class="config-table">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Como calcula</th>
            <th>Valor</th>
            <th>Espaçamento padrão (cm)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function createM2FinishPickerMarkup(row, config) {
  const selectedIds = Array.isArray(row.finishIds) ? row.finishIds : [];
  const finishes = Array.isArray(config.m2Finishes) ? config.m2Finishes : [];
  const selectedLabels = selectedIds
    .map((finishId) => finishes.find((finish) => finish.id === finishId)?.label)
    .filter(Boolean);
  const buttonLabel = selectedLabels.length
    ? `Acabamentos (${selectedLabels.length})`
    : "Sem acabamento";

  return `
    <div class="finish-picker">
      <button class="button finish-picker-button" type="button" data-finish-picker-toggle data-finish-row-id="${escapeHtml(row.id)}">
        <span>${escapeHtml(buttonLabel)}</span>
        <span class="finish-picker-chevron">▾</span>
      </button>
    </div>
  `;
}

function createCatalogTabCardMarkup(tab, title, sections, config, viewMode = "basic") {
  const products = Array.isArray(sections) ? sections.filter((item) => item?.tab === tab) : [];
  const isAdvanced = viewMode === "advanced";
  return `
    <article class="config-card nested-card">
      <div class="m2-config-heading">
        <h3>${escapeHtml(title)}</h3>
        <button class="button button-small" type="button" data-add-catalog-product="${escapeHtml(tab)}">Adicionar produto</button>
      </div>
      <p class="helper-text">Crie novos produtos para aparecer nesta aba do orçamento.</p>
      ${products.length ? `
        <div class="nested-list">
          ${products.map((product, productIndex) => `
            <div class="nested-row${isAdvanced ? " is-advanced" : ""}">
              <label>
                <span>Nome do produto</span>
                <input data-catalog-product-key="label" data-catalog-product-tab="${escapeHtml(tab)}" data-catalog-product-index="${productIndex}" type="text" value="${escapeHtml(product.label || "")}" placeholder="Ex.: Lona 440g">
              </label>
              <label${isAdvanced ? "" : ' class="is-hidden-basic"'}>
                <span>Código interno</span>
                <input data-catalog-product-key="id" data-catalog-product-tab="${escapeHtml(tab)}" data-catalog-product-index="${productIndex}" type="text" value="${escapeHtml(product.id || "")}" placeholder="Ex.: lona-440g">
              </label>
              <label${isAdvanced ? "" : ' class="is-hidden-basic"'}>
                <span>Observação opcional</span>
                <input data-catalog-product-key="note" data-catalog-product-tab="${escapeHtml(tab)}" data-catalog-product-index="${productIndex}" type="text" value="${escapeHtml(product.note || "")}" placeholder="Texto auxiliar">
              </label>
              <div class="config-row-toolbar">
                ${createConfigDeleteButtonMarkup(
                  "catalog-product",
                  {
                    "catalog-tab": tab,
                    "catalog-index": productIndex,
                  }
                )}
              </div>
            </div>
            ${tab === "m2" ? createM2ProductPricingMarkup(product, productIndex, config, viewMode) : ""}
          `).join("")}
        </div>
      ` : `<div class="empty-state"><strong>Nenhum produto extra cadastrado</strong><span>Use o botão "Adicionar produto" para montar esta aba do jeito da sua gráfica.</span></div>`}
    </article>
  `;
}

function createM2ProductPricingMarkup(product, productIndex, config, viewMode = "basic") {
  const pricingKey = product.pricingKey || "banner";
  const bands = config.m2Pricing?.[pricingKey] || [];
  const isAdvanced = viewMode === "advanced";
  return `
    <div class="m2-product-pricing">
      <div class="config-field-grid${isAdvanced ? " is-advanced" : ""}">
        <label>
          <span>Base de preços</span>
          <select data-catalog-product-key="pricingKey" data-catalog-product-tab="m2" data-catalog-product-index="${productIndex}">
            <option value="digitalCut"${pricingKey === "digitalCut" ? " selected" : ""}>Adesivo digital</option>
            <option value="uvCut"${pricingKey === "uvCut" ? " selected" : ""}>Adesivo UV</option>
            <option value="uvVerniz"${pricingKey === "uvVerniz" ? " selected" : ""}>UV com verniz/branco</option>
            <option value="flatCut"${pricingKey === "flatCut" ? " selected" : ""}>Corte reto</option>
            <option value="banner"${pricingKey === "banner" ? " selected" : ""}>Banner</option>
            <option value="perfurado"${pricingKey === "perfurado" ? " selected" : ""}>Perfurado</option>
            <option value="ps1mm"${pricingKey === "ps1mm" ? " selected" : ""}>PS 1mm</option>
            <option value="ps2mm"${pricingKey === "ps2mm" ? " selected" : ""}>PS 2mm</option>
          </select>
        </label>
        <label${isAdvanced ? "" : ' class="is-hidden-basic"'}>
          <span>Sangra automática (mm)</span>
          <input data-catalog-product-key="bleedMm" data-catalog-product-tab="m2" data-catalog-product-index="${productIndex}" type="number" step="0.01" value="${escapeHtml(product.bleedMm ?? 0)}">
        </label>
        <div>
          <span class="helper-text">Faixas de preço</span>
          <div class="toolbar">
            <button class="button button-small" type="button" data-add-m2-band="${escapeHtml(pricingKey)}">Adicionar faixa de preço</button>
          </div>
        </div>
      </div>
      ${createTableMarkup(
        ["Limite da faixa", "Valor", "Faixa"],
        bands,
        `m2-${pricingKey}`,
        [
          { key: "min", type: "number", step: "0.01" },
          { key: "value", type: "number", step: "0.01" },
          { key: "label", type: "text" },
        ]
      )}
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
  if (prefix === "credential-lanyard-printed") return config.credentialLanyardPricing?.printed;
  if (prefix === "credential-lanyard-printed-package") return config.credentialLanyardPricing?.printedPackages;
  if (prefix.startsWith("m2-")) return config.m2Pricing[prefix.slice(3)];
  if (prefix.startsWith("color-")) return config.colorPrintPricing[prefix.slice(6)];
  if (prefix.startsWith("cover-")) {
    return config.coverPricing[prefix.slice(6)];
  }
  return null;
}

function getM2Catalog(config) {
  const baseCatalog = [...M2_CATALOG];
  const extraSections = Array.isArray(config.catalogSections) ? config.catalogSections : [];
  for (const section of extraSections) {
    if (section?.tab !== "m2") {
      continue;
    }
    if (!section || typeof section !== "object" || !section.id || !section.label) {
      continue;
    }
    if (baseCatalog.some((item) => item.id === section.id)) {
      continue;
    }
    baseCatalog.push({
      id: section.id,
      label: section.label,
      configKey: `custom-${section.id}`,
      pricingKey: section.pricingKey || "banner",
      bleedMm: Number(section.bleedMm || 0),
      note: section.note || "",
    });
  }
  return baseCatalog;
}

function calculateM2FinishExtra(row, product, config) {
  const finishes = Array.isArray(config.m2Finishes) ? config.m2Finishes : [];
  const selected = finishes.filter((finish) => Array.isArray(row.finishIds) && row.finishIds.includes(finish.id));
  const dimensions = getM2RowDimensions(row);
  const widthCm = dimensions.widthCm;
  const heightCm = dimensions.heightCm;
  const areaM2 = (dimensions.widthMm * dimensions.heightMm) / 1000000;
  const perimeterCm = (widthCm * 2) + (heightCm * 2);
  const overrides = row.finishOverrides && typeof row.finishOverrides === "object" ? row.finishOverrides : {};

  return selected.reduce((sum, finish) => {
    const price = Number(finish.price || 0);
    if (finish.type === "eyelet") {
      const spacingCm = Math.max(1, Number(finish.spacingCm || 0));
      const manualPieces = toWholeNumber(overrides[finish.id]);
      const pieces = manualPieces > 0 ? manualPieces : Math.max(4, Math.ceil(perimeterCm / spacingCm));
      return sum + pieces * price;
    }
    if (finish.type === "perimeter") {
      return sum + (perimeterCm / 100) * price;
    }
    if (finish.type === "area") {
      return sum + areaM2 * price;
    }
    return sum;
  }, 0);
}

function getM2FinishSummary(row, config) {
  const finishes = Array.isArray(config.m2Finishes) ? config.m2Finishes : [];
  const selected = finishes.filter((finish) => Array.isArray(row.finishIds) && row.finishIds.includes(finish.id));
  const dimensions = getM2RowDimensions(row);
  const widthCm = dimensions.widthCm;
  const heightCm = dimensions.heightCm;
  const areaM2 = (dimensions.widthMm * dimensions.heightMm) / 1000000;
  const perimeterCm = (widthCm * 2) + (heightCm * 2);
  const overrides = row.finishOverrides && typeof row.finishOverrides === "object" ? row.finishOverrides : {};

  return selected.map((finish) => {
    if (finish.type === "eyelet") {
      const spacingCm = Math.max(1, Number(finish.spacingCm || 0));
      const manualPieces = toWholeNumber(overrides[finish.id]);
      const pieces = manualPieces > 0 ? manualPieces : Math.max(4, Math.ceil(perimeterCm / spacingCm));
      const sourceLabel = manualPieces > 0 ? "manual" : "auto";
      return `${finish.label}: ${pieces} ilhós (${sourceLabel}) | espaçamento ${spacingCm} cm`;
    }
    if (finish.type === "perimeter") {
      return `${finish.label}: ${formatMeasure(perimeterCm / 100)} m lineares`;
    }
    if (finish.type === "area") {
      return `${finish.label}: ${formatAreaM2(areaM2)} m²`;
    }
    return finish.label;
  });
}

function getM2RowDimensions(row) {
  const widthInput = Number(row.widthMm || 0);
  const heightInput = Number(row.heightMm || 0);
  const factor = row.measureUnit === "m" ? 100 : 1;
  const widthCm = widthInput * factor;
  const heightCm = heightInput * factor;
  const widthMm = widthCm * 10;
  const heightMm = heightCm * 10;
  return {
    widthCm,
    heightCm,
    widthMm,
    heightMm,
  };
}

function buildApostilaCoverDetail(row) {
  const parts = [];
  const hasCover = (row.coverType && row.coverType !== "Sem capa") || Number(row.coverTotal) > 0;
  const hasBackCover = (row.backCoverType && row.backCoverType !== "Sem contracapa") || Number(row.backTotal) > 0;

  if (hasCover) {
    parts.push(`Capa: ${row.coverType && row.coverType !== "Sem capa" ? row.coverType : "Colorida"} | ${row.coverPaper || "Papel não informado"}`);
  }

  if (hasBackCover) {
    parts.push(`Contracapa: ${row.backCoverType && row.backCoverType !== "Sem contracapa" ? row.backCoverType : "Colorida"} | ${row.backCoverPaper || "Papel não informado"}`);
  }

  return parts.join(" | ");
}

function isResinRowActive(row) {
  return Boolean((row.description || "").trim() || Number(row.widthMm) > 0 || Number(row.heightMm) > 0 || Number(row.quantity) > 0);
}

function getResinMaterialLabel(materialType) {
  return RESIN_MATERIAL_LABELS[materialType] || RESIN_MATERIAL_LABELS.white;
}

function getResinMaterialGroup(materialType) {
  return materialType === "holo-gold" || materialType === "holo-silver" ? "special" : "standard";
}

function getResinSheetUnitPrice(resinPricing, materialType, sheetsNeeded) {
  const pricingByMaterial = resinPricing?.pricingByMaterial || {};
  const table = pricingByMaterial[getResinMaterialGroup(materialType)] || pricingByMaterial.standard || {};
  if (sheetsNeeded >= 10) {
    return toMoneyNumber(table.tier10);
  }
  if (sheetsNeeded >= 5) {
    return toMoneyNumber(table.tier5);
  }
  if (sheetsNeeded >= 2) {
    return toMoneyNumber(table.tier2);
  }
  return toMoneyNumber(table.tier1);
}

function getResinLayoutOption(pieceWidthMm, pieceHeightMm) {
  const fitAcross = Math.floor(A3_WIDTH_MM / pieceWidthMm);
  const fitDown = Math.floor(A3_HEIGHT_MM / pieceHeightMm);
  const piecesPerSheet = fitAcross * fitDown;
  return {
    fitAcross,
    fitDown,
    piecesPerSheet,
    leftoverWidth: Math.max(A3_WIDTH_MM - (fitAcross * pieceWidthMm), 0),
    leftoverHeight: Math.max(A3_HEIGHT_MM - (fitDown * pieceHeightMm), 0),
  };
}

function formatResinMeasureCm(valueMm) {
  return formatMeasure(toDecimalNumber(valueMm) / 10);
}

function calculateResinRow(source, config, index) {
  const widthMm = toDecimalNumber(source.widthMm);
  const heightMm = toDecimalNumber(source.heightMm);
  const quantity = toWholeNumber(source.quantity);
  const active = isResinRowActive({ ...source, widthMm, heightMm, quantity });
  const materialType = source.materialType || "white";
  const materialLabel = getResinMaterialLabel(materialType);
  const description = (source.description || "").trim() || `Adesivo resinado ${index + 1}`;
  const resinPricing = config.resinPricing || createDefaultConfig().resinPricing;
  const artCreationFee = getArtCreationFee(source);

  const baseRow = {
    ...source,
    active,
    valid: false,
    description,
    materialType,
    materialLabel,
    widthMm,
    heightMm,
    quantity,
    finalWidthMm: widthMm > 0 ? widthMm + RESIN_MARGIN_MM : 0,
    finalHeightMm: heightMm > 0 ? heightMm + RESIN_MARGIN_MM : 0,
    fitAcross: 0,
    fitDown: 0,
    piecesPerSheet: 0,
    leftoverWidth: 0,
    leftoverHeight: 0,
    sheetsNeeded: 0,
    producedQuantity: 0,
    sheetPrice: getResinSheetUnitPrice(resinPricing, materialType, 1),
    artCreationFee,
    subtotalBeforeDiscount: 0,
    discountAmount: 0,
    discountDescription: "",
    total: 0,
    unitValue: 0,
    orientation: "-",
    minimumOrderPrice: toMoneyNumber(resinPricing.minimumOrderPrice),
    warning: "",
  };

  if (!active) {
    return baseRow;
  }

  if (!widthMm || !heightMm || !quantity) {
    return {
      ...baseRow,
      warning: `Item ${String(index + 1).padStart(2, "0")}: preencha largura, altura e quantidade maiores que zero.`,
    };
  }

  const normal = getResinLayoutOption(baseRow.finalWidthMm, baseRow.finalHeightMm);
  const rotated = getResinLayoutOption(baseRow.finalHeightMm, baseRow.finalWidthMm);
  const chosen = rotated.piecesPerSheet > normal.piecesPerSheet ? rotated : normal;
  const orientation = chosen === rotated ? "Girado para melhor aproveitamento" : "Normal";

  if (!chosen.piecesPerSheet) {
    return {
      ...baseRow,
      orientation,
      warning: `Item ${String(index + 1).padStart(2, "0")}: essa medida com a folga de resina não cabe dentro do A3.`,
    };
  }

  const sheetsNeeded = Math.ceil(quantity / chosen.piecesPerSheet);
  const producedQuantity = sheetsNeeded * chosen.piecesPerSheet;
  const sheetPrice = getResinSheetUnitPrice(resinPricing, materialType, sheetsNeeded);
  const subtotal = sheetsNeeded * sheetPrice;
  const totalWithMarkup = subtotal + (subtotal * (toMoneyNumber(resinPricing.markupPercent) / 100));
  const totalBeforeDiscount = Math.max(toMoneyNumber(resinPricing.minimumOrderPrice), totalWithMarkup);
  const rowDiscount = applyRowDiscount(source, totalBeforeDiscount + artCreationFee, quantity);
  return {
    ...baseRow,
    valid: true,
    fitAcross: chosen.fitAcross,
    fitDown: chosen.fitDown,
    piecesPerSheet: chosen.piecesPerSheet,
    leftoverWidth: chosen.leftoverWidth,
    leftoverHeight: chosen.leftoverHeight,
    sheetsNeeded,
    producedQuantity,
    sheetPrice,
    ...rowDiscount,
    orientation,
    warning: "",
  };
}

function calculateResinWorkbook(state, config) {
  const rows = state.resinItems.map((row, index) => calculateResinRow({
    ...createDefaultResinRow(index),
    ...row,
    id: row?.id || `resin-row-${index + 1}`,
  }, config, index));
  const activeRows = rows.filter((row) => row.active && row.valid);
  const warnings = rows.filter((row) => row.warning).map((row) => row.warning);
  const totalQuantity = activeRows.reduce((sum, row) => sum + row.quantity, 0);
  const totalGeneral = activeRows.reduce((sum, row) => sum + row.total, 0);
  let message = "Preencha as linhas abaixo para calcular várias medidas de resinado no mesmo orçamento.";
  let tone = "neutral";

  if (warnings.length > 0) {
    message = "Algumas linhas de resinado precisam de ajuste antes de fechar o cálculo.";
    tone = "warning";
  } else if (activeRows.length > 0) {
    message = "Cálculo de resinados atualizado com sucesso.";
    tone = "success";
  }

  return {
    rows,
    activeRows,
    warnings,
    message,
    tone,
    totals: {
      activeLines: activeRows.length,
      totalQuantity,
      totalGeneral,
      averageValue: totalQuantity > 0 ? totalGeneral / totalQuantity : 0,
    },
  };
}

function createQuoteHtml(state, workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook) {
  const dateText = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const quoteEntries = [
    ...workbook.activeRows.map((row) => {
      const coverDetail = buildApostilaCoverDetail(row);
      return {
        kind: "Apostila",
        description: row.description,
        detail: `${formatInteger(row.quantity)} apostilas | ${formatInteger(row.pages)} páginas${row.colorPages > 0 ? ` (${formatInteger(row.blackWhitePages)} PB + ${formatInteger(row.colorPages)} coloridas)` : ""} | ${buildApostilaPrintDetail(row)} | ${row.finishing}${row.bindingGroup ? ` | Grupo ${row.bindingGroup}` : ""}`,
        extraDetail: coverDetail,
        artDetail: formatArtCreationDetail(row),
        discountDetail: row.discountDescription,
        total: row.total,
      };
    }),
    ...colorWorkbook.activeRows.map((row) => ({
      kind: "Impresso colorido",
      description: row.description,
      detail: `${formatInteger(row.quantity)} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} cm | ${row.paperType} | ${row.printMode}`,
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...credentialWorkbook.activeRows.map((row) => ({
      kind: "Credencial",
      description: row.description || "Credencial",
      detail: `${formatInteger(row.quantity)} unidades | ${formatMeasure(row.widthCm)} x ${formatMeasure(row.heightCm)} cm | ${row.materialLabel} | ${row.printMode}${row.lamination === "Com laminação" ? " | Com laminação" : ""}${row.lanyardType !== "none" ? ` | ${row.lanyardLabel}` : ""}`,
      extraDetail: row.itemsPerSheet > 0 ? `${formatInteger(row.itemsPerSheet)} por A4 | ${formatInteger(row.sheetsNeeded)} folha(s) A4` : `Área total: ${formatAreaM2(row.areaM2)} m²`,
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...readyWorkbook.activeRows.map((row) => ({
      kind: "Produto pronto",
      description: row.description || row.productLabel,
      detail: `${formatInteger(row.quantity)} unidades | ${row.productLabel}`,
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...businessCardWorkbook.activeRows.map((row) => ({
      kind: "Cartões de visitas",
      description: row.description || "Cartão de visita",
      detail: `${formatInteger(row.quantity)} cartões | ${row.productionType} | ${row.materialLabel} | ${row.printMode} | Pacote: ${row.packageLabel}`,
      extraDetail: row.extraFinishTotal > 0 ? `Acabamento adicional: ${formatCurrency(row.extraFinishTotal)}` : "",
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...flyerWorkbook.activeRows.map((row) => ({
      kind: "Panfletos e folders",
      description: row.description || "Panfleto/folder",
      detail: `${formatInteger(row.quantity)} unidades | ${row.productionType} | ${row.paper} | ${row.size} | ${row.printMode}${row.foldType !== "Sem dobra" ? ` | ${row.foldType}` : ""}`,
      extraDetail: row.foldTotal > 0 ? `Dobra: ${formatCurrency(row.foldTotal)}` : "",
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...m2Workbook.activeRows.map((row) => ({
      kind: "Cálculo de m²",
      description: getM2RowDescription(row),
      detail: `${formatInteger(row.quantity)} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} ${row.measureUnit || "cm"} | ${formatAreaM2(row.areaM2)} m² | ${row.productLabel}${row.finishSummary ? ` | ${row.finishSummary}` : ""}`,
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
    ...resinWorkbook.activeRows.map((row) => ({
      kind: "Resinados",
      description: row.description,
      detail: `${formatInteger(row.quantity)} unidades | ${formatResinMeasureCm(row.widthMm)} x ${formatResinMeasureCm(row.heightMm)} cm | ${row.materialLabel} | ${formatInteger(row.sheetsNeeded)} folha(s) A3 | ${formatInteger(row.piecesPerSheet)} por folha`,
      extraDetail: `Com resina: ${formatResinMeasureCm(row.finalWidthMm)} x ${formatResinMeasureCm(row.finalHeightMm)} cm | ${row.orientation}`,
      artDetail: formatArtCreationDetail(row),
      discountDetail: row.discountDescription,
      total: row.total,
    })),
  ];
  const combinedSubtotal = workbook.totals.totalGeneral + colorWorkbook.totals.totalGeneral + credentialWorkbook.totals.totalGeneral + readyWorkbook.totals.totalGeneral + businessCardWorkbook.totals.totalGeneral + flyerWorkbook.totals.totalGeneral + m2Workbook.totals.totalGeneral + resinWorkbook.totals.totalGeneral;
  const quoteDiscount = calculateDiscount(combinedSubtotal, state.quoteDiscountType, state.quoteDiscountValue);
  const combinedTotal = quoteDiscount.total;
  const combinedUnits = workbook.totals.totalQuantity + colorWorkbook.totals.totalQuantity + credentialWorkbook.totals.totalQuantity + readyWorkbook.totals.totalQuantity + businessCardWorkbook.totals.totalQuantity + flyerWorkbook.totals.totalQuantity + m2Workbook.totals.totalQuantity + resinWorkbook.totals.totalQuantity;
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
                ${entry.extraDetail ? `<small class="quote-extra-detail">${escapeHtml(entry.extraDetail)}</small>` : ""}
                ${entry.artDetail ? `<small class="quote-extra-detail">${escapeHtml(entry.artDetail)}</small>` : ""}
                ${entry.discountDetail ? `<small class="quote-discount-detail">${escapeHtml(entry.discountDetail)}</small>` : ""}
              </div>
              <div>${formatCurrency(entry.total)}</div>
            </div>
          `
        )
        .join("")
    : `<div class="empty-state"><strong>Seu orçamento ainda está vazio</strong><span>Adicione itens nas abas de cálculo para montar uma prévia pronta para copiar, imprimir ou salvar em PDF.</span></div>`;

  const notesMarkup = state.quoteNotes?.trim()
    ? `<div class="quote-box"><h3>Observações</h3><p class="quote-muted">${escapeHtml(state.quoteNotes).replaceAll("\n", "<br>")}</p></div>`
    : "";

  const logoMarkup = state.company.logoDataUrl
    ? `<div class="logo-box"><img src="${state.company.logoDataUrl}" alt="Logo da empresa"></div>`
    : document.getElementById("logo-placeholder-template").innerHTML;

  return `
    <div class="quote-sheet">
      <div class="quote-header">
        ${logoMarkup}
        <div class="quote-company-block">
          <p class="eyebrow">Orçamento</p>
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
          <p class="quote-muted">Nome / Razão social: ${escapeHtml(state.client.name || "-")}</p>
          <p class="quote-muted">Contato: ${escapeHtml(state.client.contact || "-")}</p>
          <p class="quote-muted">CNPJ: ${escapeHtml(state.client.cnpj || "-")}</p>
        </div>
        <div class="quote-box">
          <h3>Pagamento</h3>
          <p class="quote-muted">${escapeHtml(state.paymentTerms || "-")}</p>
        </div>
        <div class="quote-box">
          <h3>Prazo de produção</h3>
          <p class="quote-muted">${escapeHtml(state.productionDeadline || "-")}</p>
        </div>
      </div>

      <div class="quote-box">
        <h3>Itens do orçamento</h3>
        <div class="quote-lines">${lineItemsMarkup}</div>
      </div>

      ${notesMarkup}

      <div class="quote-total-bar">
        <div>
          <strong>Total geral</strong>
          <p class="quote-muted">Total de unidades: ${formatInteger(combinedUnits)}</p>
          ${quoteDiscount.hasDiscount ? `<p class="quote-muted">Subtotal: ${formatCurrency(combinedSubtotal)}</p><p class="quote-discount-detail">Desconto geral: ${formatDiscountValue(quoteDiscount.type, quoteDiscount.value)} (-${formatCurrency(quoteDiscount.amount)})</p>` : ""}
        </div>
        <strong>${formatCurrency(combinedTotal)}</strong>
      </div>
    </div>
  `;
}

function createQuoteText(state, workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook) {
  const dateText = new Intl.DateTimeFormat("pt-BR").format(new Date());
  const lines = [
    `ORÇAMENTO | ${state.company.name || "Sua empresa"}`,
    `Data: ${dateText}`,
    `CNPJ: ${state.company.cnpj || "-"}`,
    `Endereço: ${state.company.address || "-"}`,
    "",
    `Cliente: ${state.client.name || "-"}`,
    `Contato: ${state.client.contact || "-"}`,
    `CNPJ cliente: ${state.client.cnpj || "-"}`,
    `Pagamento: ${state.paymentTerms || "-"}`,
    `Prazo de produção: ${state.productionDeadline || "-"}`,
    "",
    "Itens:",
  ];

  const quoteEntries = [
    ...workbook.activeRows.map((row, index) => {
      const coverDetail = buildApostilaCoverDetail(row);
      return {
        text: `- ${row.description || `Apostila ${index + 1}`} | ${row.quantity} apostilas | ${row.pages} páginas${row.colorPages > 0 ? ` (${row.blackWhitePages} PB + ${row.colorPages} coloridas)` : ""} | ${buildApostilaPrintDetail(row)} | ${row.finishing}${row.bindingGroup ? ` | Grupo ${row.bindingGroup}` : ""}${coverDetail ? ` | ${coverDetail}` : ""}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
      };
    }),
    ...colorWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Impresso ${index + 1}`} | ${row.quantity} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} cm | ${row.paperType} | ${row.printMode}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...credentialWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Credencial ${index + 1}`} | ${row.quantity} unidades | ${formatMeasure(row.widthCm)} x ${formatMeasure(row.heightCm)} cm | ${row.materialLabel} | ${row.printMode}${row.lamination === "Com laminação" ? " | Com laminação" : ""}${row.lanyardType !== "none" ? ` | ${row.lanyardLabel}` : ""}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...readyWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Produto pronto ${index + 1}`} | ${row.quantity} unidades | ${row.productLabel}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...businessCardWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Cartão de visita ${index + 1}`} | ${row.quantity} cartões | ${row.productionType} | ${row.materialLabel} | ${row.printMode} | Pacote: ${row.packageLabel}${row.extraFinishTotal > 0 ? ` | Acabamento adicional: ${formatCurrency(row.extraFinishTotal)}` : ""}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...flyerWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Panfleto/folder ${index + 1}`} | ${row.quantity} unidades | ${row.productionType} | ${row.paper} | ${row.size} | ${row.printMode}${row.foldType !== "Sem dobra" ? ` | ${row.foldType}` : ""}${row.foldTotal > 0 ? ` | Dobra: ${formatCurrency(row.foldTotal)}` : ""}${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
    ...m2Workbook.activeRows.map((row, index) => ({
      text: `- ${getM2RowDescription(row) || `M² ${index + 1}`} | ${row.quantity} unidades | ${formatMeasure(row.widthMm)} x ${formatMeasure(row.heightMm)} ${row.measureUnit || "cm"} | ${formatAreaM2(row.areaM2)} m² | ${row.finishSummary ? `${row.finishSummary} | ` : ""}${formatArtCreationDetail(row) ? `${formatArtCreationDetail(row)} | ` : ""}${row.discountDescription ? `${row.discountDescription} | ` : ""}${formatCurrency(row.total)}`,
    })),
    ...resinWorkbook.activeRows.map((row, index) => ({
      text: `- ${row.description || `Resinado ${index + 1}`} | ${row.quantity} unidades | ${formatResinMeasureCm(row.widthMm)} x ${formatResinMeasureCm(row.heightMm)} cm | ${row.materialLabel} | ${row.sheetsNeeded} folha(s) A3 | ${row.piecesPerSheet} por folha${formatArtCreationDetail(row) ? ` | ${formatArtCreationDetail(row)}` : ""}${row.discountDescription ? ` | ${row.discountDescription}` : ""} | ${formatCurrency(row.total)}`,
    })),
  ];

  if (quoteEntries.length === 0) {
    lines.push("- Nenhum item preenchido.");
  } else {
    quoteEntries.forEach((entry) => lines.push(entry.text));
  }

  const combinedSubtotal = workbook.totals.totalGeneral + colorWorkbook.totals.totalGeneral + credentialWorkbook.totals.totalGeneral + readyWorkbook.totals.totalGeneral + businessCardWorkbook.totals.totalGeneral + flyerWorkbook.totals.totalGeneral + m2Workbook.totals.totalGeneral + resinWorkbook.totals.totalGeneral;
  const quoteDiscount = calculateDiscount(combinedSubtotal, state.quoteDiscountType, state.quoteDiscountValue);
  if (quoteDiscount.hasDiscount) {
    lines.push("", `Subtotal: ${formatCurrency(combinedSubtotal)}`);
    lines.push(`Desconto geral: ${formatDiscountValue(quoteDiscount.type, quoteDiscount.value)} (-${formatCurrency(quoteDiscount.amount)})`);
    lines.push(`Total geral: ${formatCurrency(quoteDiscount.total)}`);
  } else {
    lines.push("", `Total geral: ${formatCurrency(combinedSubtotal)}`);
  }

  if (state.quoteNotes?.trim()) {
    lines.push("", "Observações:", state.quoteNotes.trim());
  }

  return lines.join("\n");
}

async function initApp() {
  const state = loadFromStorage(STORAGE_KEYS.state, mergeState);
  const config = loadFromStorage(STORAGE_KEYS.config, mergeConfig);
  let configViewMode = loadConfigViewMode();
  let activeConfigSection = loadConfigSection();
  let lastConfigSourceTab = activeConfigSection === "impressos" || activeConfigSection === "credenciais" || activeConfigSection === "produtos-prontos" || activeConfigSection === "cartoes" || activeConfigSection === "panfletos" || activeConfigSection === "m2" || activeConfigSection === "resinados" ? activeConfigSection : "calculo";
  let isConfigUnlocked = loadSessionFlag(SESSION_KEYS.configUnlocked);
  let sharedSyncTimer = null;
  let sharedSyncInFlight = false;
  let sharedSyncQueued = false;
  let sharedBootstrapComplete = false;
  let sharedUpdatedAt = "";
  let lastSharedSnapshot = "";
  let sharedRefreshHandle = null;
  const selectedRowIds = new Set();
  ensureRowCount(state, 5);
  ensureColorRowCount(state, 5);
  ensureCredentialRowCount(state, 5);
  ensureReadyProductRowCount(state, 5);
  ensureBusinessCardRowCount(state, 5);
  ensureFlyerRowCount(state, 5);
  ensureM2RowCount(state, 5);
  ensureResinRowCount(state, 5);
  state.rows = trimEmptyRows(state.rows, 5, isRowActive);
  state.colorPrintItems = trimEmptyRows(state.colorPrintItems, 5, isColorPrintRowActive);
  state.credentialItems = trimEmptyRows(state.credentialItems, 5, isCredentialRowActive);
  state.readyProductItems = trimEmptyRows(state.readyProductItems, 5, isReadyProductRowActive);
  state.businessCardItems = trimEmptyRows(state.businessCardItems, 5, isBusinessCardRowActive);
  state.flyerItems = trimEmptyRows(state.flyerItems, 5, isFlyerRowActive);
  state.m2Items = trimEmptyRows(state.m2Items, 5, (row) => Boolean(row.description?.trim() || Number(row.quantity) > 0 || Number(row.widthMm) > 0 || Number(row.heightMm) > 0));
  state.resinItems = trimEmptyRows(state.resinItems, 5, isResinRowActive);

  const rowsTableBody = document.getElementById("rows-table-body");
  const colorRowsTableBody = document.getElementById("color-rows-table-body");
  const credentialRowsTableBody = document.getElementById("credential-rows-table-body");
  const readyRowsTableBody = document.getElementById("ready-rows-table-body");
  const businessCardRowsTableBody = document.getElementById("business-card-rows-table-body");
  const flyerRowsTableBody = document.getElementById("flyer-rows-table-body");
  const resinRowsTableBody = document.getElementById("resin-rows-table-body");
  const warningList = document.getElementById("warning-list");
  const colorWarningList = document.getElementById("color-warning-list");
  const credentialWarningList = document.getElementById("credential-warning-list");
  const readyWarningList = document.getElementById("ready-warning-list");
  const businessCardWarningList = document.getElementById("business-card-warning-list");
  const flyerWarningList = document.getElementById("flyer-warning-list");
  const m2WarningList = document.getElementById("m2-warning-list");
  const resinWarningList = document.getElementById("resin-warning-list");
  const configSections = document.getElementById("config-sections");
  const clientsList = document.getElementById("clients-list");
  const historyList = document.getElementById("history-list");
  const m2RowsTableBody = document.getElementById("m2-rows-table-body");
  const quotePreview = document.getElementById("quote-preview");
  const feedback = document.getElementById("import-feedback");
  const colorFeedback = document.getElementById("color-feedback");
  const credentialFeedback = document.getElementById("credential-feedback");
  const readyFeedback = document.getElementById("ready-feedback");
  const businessCardFeedback = document.getElementById("business-card-feedback");
  const flyerFeedback = document.getElementById("flyer-feedback");
  const resinFeedback = document.getElementById("resin-feedback");
  const configStatus = document.getElementById("config-status");
  const syncStatus = document.getElementById("sync-status");
  const spiralDiscountInput = document.getElementById("spiral-discount-input");
  const lockConfigButton = document.getElementById("lock-config-button");
  const confirmModal = document.getElementById("confirm-modal");
  const confirmModalKicker = document.getElementById("confirm-modal-kicker");
  const confirmModalTitle = document.getElementById("confirm-modal-title");
  const confirmModalMessage = document.getElementById("confirm-modal-message");
  const confirmModalConfirm = document.getElementById("confirm-modal-confirm");
  const confirmModalCancel = document.getElementById("confirm-modal-cancel");
  const clientRecordName = document.getElementById("client-record-name");
  const clientRecordContact = document.getElementById("client-record-contact");
  const clientRecordCnpj = document.getElementById("client-record-cnpj");
  const clientRecordNotes = document.getElementById("client-record-notes");
  const clientsFeedback = document.getElementById("clients-feedback");

  const tabButtons = [...document.querySelectorAll(".tab-button")];
  const tabPanels = [...document.querySelectorAll(".tab-panel")];
  let activeClientEditorId = "";

  function setStatusMessage(element, message, tone = "neutral") {
    if (!element) {
      return;
    }
    element.textContent = message;
    if (tone === "neutral") {
      delete element.dataset.tone;
      return;
    }
    element.dataset.tone = tone;
  }

  function setConfigStatus(message, tone = "neutral") {
    setStatusMessage(configStatus, message, tone);
  }

  function setMainFeedback(message, tone = "neutral") {
    setStatusMessage(feedback, message, tone);
  }

  function setColorFeedback(message, tone = "neutral") {
    setStatusMessage(colorFeedback, message, tone);
  }

  function setCredentialFeedback(message, tone = "neutral") {
    setStatusMessage(credentialFeedback, message, tone);
  }

  function setReadyFeedback(message, tone = "neutral") {
    setStatusMessage(readyFeedback, message, tone);
  }

  function setBusinessCardFeedback(message, tone = "neutral") {
    setStatusMessage(businessCardFeedback, message, tone);
  }

  function setFlyerFeedback(message, tone = "neutral") {
    setStatusMessage(flyerFeedback, message, tone);
  }

  function setResinFeedback(message, tone = "neutral") {
    setStatusMessage(resinFeedback, message, tone);
  }

  function setClientsFeedback(message, tone = "neutral") {
    setStatusMessage(clientsFeedback, message, tone);
  }

  function setSyncStatus(message, tone = "neutral") {
    setStatusMessage(syncStatus, message, tone);
  }

  const customTabOrderSelector = [
    'input:not([type="hidden"]):not([disabled]):not([readonly])',
    "select:not([disabled])",
    "textarea:not([disabled]):not([readonly])",
    "button[data-credential-lanyard-toggle]:not([disabled])",
    "button[data-m2-finish-toggle]:not([disabled])",
  ].join(", ");

  function getActiveTabPanel() {
    return tabPanels.find((panel) => panel.classList.contains("is-active")) || null;
  }

  function isTabOrderElementVisible(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }

    if (element.hidden || element.closest("[hidden]")) {
      return false;
    }

    if (element.getAttribute("aria-hidden") === "true" || element.closest('[aria-hidden="true"]')) {
      return false;
    }

    return element.offsetParent !== null || element === document.activeElement;
  }

  function getCustomTabOrderElements(panel) {
    if (!(panel instanceof HTMLElement)) {
      return [];
    }

    return [...panel.querySelectorAll(customTabOrderSelector)].filter((element) => isTabOrderElementVisible(element));
  }

  function shouldUseCustomTabOrder(target) {
    if (!(target instanceof HTMLElement)) {
      return false;
    }

    if (target.closest("#confirm-modal:not([hidden])")) {
      return false;
    }

    if (target.closest("#credential-lanyard-popover") || target.closest("#business-card-quantity-popover") || target.closest("#m2-finish-popover")) {
      return false;
    }

    if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
      return false;
    }

    return true;
  }

  function readClientRecordForm() {
    return {
      name: clientRecordName?.value.trim() || "",
      contact: clientRecordContact?.value.trim() || "",
      cnpj: clientRecordCnpj?.value.trim() || "",
      notes: clientRecordNotes?.value.trim() || "",
    };
  }

  function fillClientRecordForm(client = {}) {
    if (clientRecordName) {
      clientRecordName.value = client.name || "";
    }
    if (clientRecordContact) {
      clientRecordContact.value = client.contact || "";
    }
    if (clientRecordCnpj) {
      clientRecordCnpj.value = client.cnpj || "";
    }
    if (clientRecordNotes) {
      clientRecordNotes.value = client.notes || "";
    }
  }

  function resetClientRecordForm() {
    activeClientEditorId = "";
    fillClientRecordForm();
  }

  function buildQuoteDocumentTitle() {
    const clientName = (state.client.name || "").trim();
    const safeClientName = clientName.replace(/[\\/:*?"<>|]+/g, " ").replace(/\s+/g, " ").trim();
    return safeClientName ? `Orçamento - ${safeClientName}` : "Orçamento";
  }

  function persistLocalOnly() {
    saveToStorage(STORAGE_KEYS.state, state);
    saveToStorage(STORAGE_KEYS.config, config);
  }

  function createSharedStateSnapshot() {
    return {
      clients: deepClone(state.clients),
      quoteHistory: deepClone(state.quoteHistory),
    };
  }

  function createSharedPayload() {
    return {
      state: createSharedStateSnapshot(),
      config: deepClone(config),
    };
  }

  function applySharedStateSnapshot(sharedState) {
    if (!sharedState || typeof sharedState !== "object") {
      return;
    }

    if (Array.isArray(sharedState.clients)) {
      state.clients = mergeState({ clients: sharedState.clients }).clients;
    }

    if (Array.isArray(sharedState.quoteHistory)) {
      state.quoteHistory = mergeState({ quoteHistory: sharedState.quoteHistory }).quoteHistory;
    }
  }

  function applySharedPayload(payload, successMessage) {
    if (!payload || typeof payload !== "object") {
      return;
    }

    applySharedStateSnapshot(payload.state);
    Object.assign(config, mergeConfig(payload.config));
    persistLocalOnly();
    renderAll();
    if (successMessage) {
      setSyncStatus(successMessage, "success");
    }
  }

  async function flushSharedSave(force = false) {
    if (!sharedBootstrapComplete && !force) {
      return;
    }

    if (sharedSyncInFlight) {
      sharedSyncQueued = true;
      return;
    }

    const payload = createSharedPayload();
    const serialized = JSON.stringify(payload);
    if (!force && serialized === lastSharedSnapshot) {
      return;
    }

    sharedSyncInFlight = true;
    setSyncStatus("Salvando alterações na base compartilhada...", "warning");

    try {
      const result = await requestSharedState("PUT", payload);
      lastSharedSnapshot = serialized;
      sharedUpdatedAt = result.updatedAt || new Date().toISOString();
      setSyncStatus("Tudo salvo e compartilhado entre os computadores.", "success");
    } catch {
      setSyncStatus("Não foi possível atualizar a base compartilhada agora. O app continua funcionando nesta máquina.", "error");
    } finally {
      sharedSyncInFlight = false;
      if (sharedSyncQueued) {
        sharedSyncQueued = false;
        void flushSharedSave(force);
      }
    }
  }

  function queueSharedSave(force = false) {
    if (sharedSyncTimer) {
      clearTimeout(sharedSyncTimer);
    }

    if (force) {
      void flushSharedSave(true);
      return;
    }

    if (!sharedBootstrapComplete) {
      return;
    }

    sharedSyncTimer = setTimeout(() => {
      sharedSyncTimer = null;
      void flushSharedSave(false);
    }, 500);
  }

  async function refreshSharedState(showMessage = false) {
    if (!sharedBootstrapComplete || sharedSyncInFlight) {
      return;
    }

    try {
      const result = await requestSharedState("GET");
      if (!result?.exists || !result.payload) {
        return;
      }

      const serialized = JSON.stringify(result.payload);
      if (serialized === lastSharedSnapshot || result.updatedAt === sharedUpdatedAt) {
        return;
      }

      sharedUpdatedAt = result.updatedAt || "";
      lastSharedSnapshot = serialized;
      applySharedPayload(
        result.payload,
        showMessage ? "Dados compartilhados atualizados com mudanças feitas em outro computador." : ""
      );
    } catch {
      if (showMessage) {
        setSyncStatus("A base compartilhada não respondeu agora. Tente novamente em instantes.", "error");
      }
    }
  }

  async function bootstrapSharedState() {
    setSyncStatus("Conectando a base compartilhada...", "warning");

    try {
      const result = await requestSharedState("GET");
      sharedBootstrapComplete = true;

      if (result?.exists && result.payload) {
        sharedUpdatedAt = result.updatedAt || "";
        lastSharedSnapshot = JSON.stringify(result.payload);
        applySharedPayload(result.payload, "Base compartilhada conectada com sucesso.");
        if (lastSharedSnapshot !== JSON.stringify(createSharedPayload())) {
          lastSharedSnapshot = "";
          await flushSharedSave(true);
        }
        return;
      }

      persistLocalOnly();
      await flushSharedSave(true);
    } catch {
      sharedBootstrapComplete = true;
      setSyncStatus("Não foi possível conectar a base compartilhada agora. O app segue disponível nesta máquina.", "error");
    }
  }

  function startSharedRefresh() {
    if (sharedRefreshHandle || typeof window === "undefined") {
      return;
    }

    sharedRefreshHandle = window.setInterval(() => {
      if (typeof document !== "undefined" && document.hidden) {
        return;
      }
      void refreshSharedState(false);
    }, SHARED_SYNC_INTERVAL_MS);

    window.addEventListener("focus", () => {
      void refreshSharedState(true);
    });
  }

  function focusConfigPasswordField() {
    requestAnimationFrame(() => {
      document.getElementById("config-password-input")?.focus();
    });
  }

  function updateConfigAccessUi() {
    const locked = !isConfigUnlocked;
    const configButtons = [
      document.getElementById("save-config-button"),
      document.getElementById("export-config-button"),
      document.getElementById("import-config-button"),
      document.getElementById("reset-config-button"),
    ];

    configButtons.forEach((button) => {
      if (button) {
        button.disabled = locked;
      }
    });

    if (spiralDiscountInput) {
      spiralDiscountInput.disabled = locked;
    }

    if (lockConfigButton) {
      lockConfigButton.hidden = locked;
      lockConfigButton.disabled = false;
    }
  }

  function lockConfiguration(message = "Configuração bloqueada novamente.", tone = "warning") {
    isConfigUnlocked = false;
    saveSessionFlag(SESSION_KEYS.configUnlocked, false);
    renderConfig();
    setConfigStatus(message, tone);
    focusConfigPasswordField();
  }

  function unlockConfiguration(password) {
    if (password !== CONFIG_ACCESS_PASSWORD) {
      setConfigStatus("Senha incorreta. A configuração continua bloqueada.", "error");
      focusConfigPasswordField();
      return false;
    }

    isConfigUnlocked = true;
    saveSessionFlag(SESSION_KEYS.configUnlocked, true);
    renderConfig();
    setConfigStatus("Configuração desbloqueada nesta sessão.", "success");
    return true;
  }

  function selectTab(tabName) {
    if (tabName === "configuracao") {
      activeConfigSection = lastConfigSourceTab === "impressos" || lastConfigSourceTab === "credenciais" || lastConfigSourceTab === "produtos-prontos" || lastConfigSourceTab === "cartoes" || lastConfigSourceTab === "panfletos" || lastConfigSourceTab === "m2" || lastConfigSourceTab === "resinados" ? lastConfigSourceTab : "calculo";
      saveConfigSection(activeConfigSection);
      renderConfig();
      if (!isConfigUnlocked) {
        setConfigStatus("Digite a senha para acessar a configuração.", "warning");
        focusConfigPasswordField();
      }
    } else if (tabName === "calculo" || tabName === "impressos" || tabName === "credenciais" || tabName === "produtos-prontos" || tabName === "cartoes" || tabName === "panfletos" || tabName === "m2" || tabName === "resinados") {
      lastConfigSourceTab = tabName;
    }
    tabButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.tabTarget === tabName);
    });
    tabPanels.forEach((panel) => {
      panel.classList.toggle("is-active", panel.dataset.tabPanel === tabName);
    });
  }

  function persist() {
    persistLocalOnly();
    queueSharedSave(false);
  }

  function renderPresetControls() {
    document.getElementById("calc-mode-select").value = state.calcMode;
    document.getElementById("m2-calc-mode-select").value = state.m2CalcMode;
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
    document.getElementById("production-deadline").value = state.productionDeadline;
    document.getElementById("quote-discount-type").value = normalizeDiscountType(state.quoteDiscountType);
    document.getElementById("quote-discount-value").value = state.quoteDiscountValue || 0;
    document.getElementById("quote-notes").value = state.quoteNotes;
    document.getElementById("company-name").value = state.company.name;
    document.getElementById("company-cnpj").value = state.company.cnpj;
    document.getElementById("company-contact").value = state.company.contact;
    document.getElementById("company-address").value = state.company.address;
  }

  function renderConfig() {
    configSections.innerHTML = isConfigUnlocked
      ? createConfigSectionsMarkup(config, configViewMode, activeConfigSection)
      : createConfigLockedMarkup();
    if (spiralDiscountInput) {
      spiralDiscountInput.value = config.spiralPlasticDiscount;
    }
    updateConfigAccessUi();
  }

  function saveConfiguration() {
    persist();
    renderAll();
    setConfigStatus("Alterações salvas com sucesso.", "success");
    const button = document.getElementById("save-config-button");
    if (button) {
      const original = button.textContent;
      button.textContent = "Alterações salvas";
      setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }
  }

  function removeConfigRow(prefix, rowIndex) {
    const array = getConfigArrayByPrefix(config, prefix);
    if (!Array.isArray(array) || array.length <= 1 || !array[rowIndex]) {
      return false;
    }
    array.splice(rowIndex, 1);
    return true;
  }

  function removeM2Finish(rowIndex) {
    const finish = config.m2Finishes?.[rowIndex];
    if (!finish || config.m2Finishes.length <= 1) {
      return false;
    }
    config.m2Finishes.splice(rowIndex, 1);
    state.m2Items.forEach((row) => {
      row.finishIds = Array.isArray(row.finishIds) ? row.finishIds.filter((id) => id !== finish.id) : [];
      if (row.finishOverrides && typeof row.finishOverrides === "object") {
        delete row.finishOverrides[finish.id];
      }
    });
    return true;
  }

  function removeCatalogProduct(tab, visibleIndex) {
    const products = config.catalogSections.filter((item) => item?.tab === tab);
    const product = products[visibleIndex];
    if (!product) {
      return false;
    }

    const sourceIndex = config.catalogSections.findIndex((item) => item?.id === product.id && item?.tab === tab);
    if (sourceIndex === -1) {
      return false;
    }

    config.catalogSections.splice(sourceIndex, 1);
    if (tab === "m2") {
      const removedPricingKey = product.pricingKey;
      const isBaseKey = M2_CATALOG.some((item) => item.configKey === removedPricingKey);
      if (removedPricingKey && !isBaseKey) {
        delete config.m2Pricing[removedPricingKey];
      }
      state.m2Items.forEach((row) => {
        if (row.productId === product.id) {
          row.productId = M2_CATALOG[0].id;
        }
      });
    }
    return true;
  }

  function confirmAppAction(options = {}) {
    const {
      kicker = "Confirmação",
      title = "Confirmar ação",
      message = "Deseja realmente continuar?",
      confirmLabel = "Confirmar",
      danger = true,
    } = options;

    if (!confirmModal || !confirmModalKicker || !confirmModalTitle || !confirmModalMessage || !confirmModalConfirm || !confirmModalCancel) {
      return Promise.resolve(true);
    }

    confirmModalKicker.textContent = kicker;
    confirmModalTitle.textContent = title;
    confirmModalMessage.textContent = message;
    confirmModalConfirm.textContent = confirmLabel;
    confirmModalConfirm.classList.toggle("button-danger", danger);
    confirmModalConfirm.classList.toggle("button-primary", !danger);
    confirmModal.hidden = false;
    document.body.style.overflow = "hidden";

    return new Promise((resolve) => {
      let settled = false;

      const finish = (result) => {
        if (settled) {
          return;
        }
        settled = true;
        confirmModal.hidden = true;
        document.body.style.overflow = "";
        confirmModalConfirm.removeEventListener("click", onConfirm);
        confirmModalCancel.removeEventListener("click", onCancel);
        confirmModal.removeEventListener("click", onBackdrop);
        document.removeEventListener("keydown", onKeydown);
        resolve(result);
      };

      const onConfirm = () => finish(true);
      const onCancel = () => finish(false);
      const onBackdrop = (event) => {
        if (event.target instanceof HTMLElement && event.target.hasAttribute("data-modal-close")) {
          finish(false);
        }
      };
      const onKeydown = (event) => {
        if (event.key === "Escape") {
          finish(false);
        }
      };

      confirmModalConfirm.addEventListener("click", onConfirm);
      confirmModalCancel.addEventListener("click", onCancel);
      confirmModal.addEventListener("click", onBackdrop);
      document.addEventListener("keydown", onKeydown);
      confirmModalConfirm.focus();
    });
  }

  function confirmConfigDelete(message) {
    return confirmAppAction({
      kicker: "Exclusão",
      title: "Confirmar exclusão",
      message,
      confirmLabel: "Excluir",
      danger: true,
    });
  }

  function renderClientsTab() {
    document.getElementById("clients-count").textContent = formatInteger(state.clients.length);
    document.getElementById("clients-latest").textContent = state.clients[0]?.name || "Nenhum cliente salvo";
    clientsList.innerHTML = state.clients.length
      ? state.clients
          .map(
            (client) => `
              <article class="list-card" data-client-id="${escapeHtml(client.id)}">
                <div>
                  <h3>${escapeHtml(client.name || "Sem nome")}</h3>
                  <p>${escapeHtml(client.contact || "Sem contato")}</p>
                  <p class="list-meta">${escapeHtml(client.cnpj || "Sem CNPJ")}</p>
                  ${client.notes ? `<p class="list-notes">${escapeHtml(client.notes)}</p>` : ""}
                  <p class="list-meta">Criado em ${escapeHtml(formatDateTime(client.createdAt) || "data indisponível")}</p>
                </div>
                <div class="list-actions">
                  <button class="button button-primary" type="button" data-client-action="load" data-client-id="${escapeHtml(client.id)}">Usar no orçamento</button>
                  <button class="button" type="button" data-client-action="edit" data-client-id="${escapeHtml(client.id)}">Editar</button>
                  <button class="button button-danger" type="button" data-client-action="delete" data-client-id="${escapeHtml(client.id)}">Excluir</button>
                </div>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state"><strong>Nenhum cliente salvo ainda</strong><span>Preencha o cadastro ao lado ou use os dados do orçamento atual para montar sua base compartilhada de contatos.</span></div>`;
  }

  function renderHistoryTab() {
    const totalQuotes = state.quoteHistory.length;
    const totalValue = state.quoteHistory.reduce((sum, item) => sum + Number(item.total || 0), 0);
    document.getElementById("history-count").textContent = formatInteger(totalQuotes);
    document.getElementById("history-total").textContent = formatCurrency(totalValue);
    historyList.innerHTML = state.quoteHistory.length
      ? state.quoteHistory
          .map(
            (item) => `
              <article class="list-card" data-quote-id="${escapeHtml(item.id)}">
                <div>
                  <h3>${escapeHtml(item.title || "Orçamento salvo")}</h3>
                  <p>${escapeHtml(item.clientName || "Cliente não informado")}</p>
                  <p class="list-meta">${escapeHtml(formatDateTime(item.createdAt) || "data indisponível")}</p>
                  ${item.summary ? `<p class="list-notes">${escapeHtml(item.summary)}</p>` : ""}
                </div>
                <div class="list-actions">
                  <button class="button button-primary" type="button" data-history-action="load-client" data-quote-id="${escapeHtml(item.id)}">Usar cliente</button>
                  <button class="button" type="button" data-history-action="copy" data-quote-id="${escapeHtml(item.id)}">Copiar resumo</button>
                  <button class="button button-danger" type="button" data-history-action="delete" data-quote-id="${escapeHtml(item.id)}">Excluir</button>
                </div>
              </article>
            `
          )
          .join("")
      : `<div class="empty-state"><strong>Nenhum orçamento salvo ainda</strong><span>Salve um fechamento para manter um histórico rápido de clientes, valores e resumos recentes.</span></div>`;
  }

  function renderRowsAndSummary() {
    const workbook = calculateWorkbook(state, config);
    const colorWorkbook = calculateColorPrintWorkbook(state, config);
    const credentialWorkbook = calculateCredentialWorkbook(state, config);
    const readyWorkbook = calculateReadyProductWorkbook(state, config);
    const businessCardWorkbook = calculateBusinessCardWorkbook(state);
    const flyerWorkbook = calculateFlyerWorkbook(state);
    const m2Workbook = calculateM2WorkbookFromConfig(state, config);
    const resinWorkbook = calculateResinWorkbook(state, config);
    const m2Catalog = getM2Catalog(config);

    document.getElementById("summary-active-lines").textContent = formatInteger(workbook.totals.activeLines);
    document.getElementById("summary-booklets").textContent = formatInteger(workbook.totals.totalQuantity);
    document.getElementById("summary-total").textContent = formatCurrency(workbook.totals.totalGeneral);
    document.getElementById("summary-average").textContent = formatCurrency(workbook.totals.averageValue);

    document.getElementById("color-summary-active").textContent = formatInteger(colorWorkbook.totals.activeLines);
    document.getElementById("color-summary-quantity").textContent = formatInteger(colorWorkbook.totals.totalQuantity);
    document.getElementById("color-summary-total").textContent = formatCurrency(colorWorkbook.totals.totalGeneral);
    document.getElementById("color-summary-average").textContent = formatCurrency(colorWorkbook.totals.averageValue);

    document.getElementById("credential-summary-active").textContent = formatInteger(credentialWorkbook.totals.activeLines);
    document.getElementById("credential-summary-quantity").textContent = formatInteger(credentialWorkbook.totals.totalQuantity);
    document.getElementById("credential-summary-total").textContent = formatCurrency(credentialWorkbook.totals.totalGeneral);
    document.getElementById("credential-summary-average").textContent = formatCurrency(credentialWorkbook.totals.averageValue);

    document.getElementById("ready-summary-active").textContent = formatInteger(readyWorkbook.totals.activeLines);
    document.getElementById("ready-summary-quantity").textContent = formatInteger(readyWorkbook.totals.totalQuantity);
    document.getElementById("ready-summary-total").textContent = formatCurrency(readyWorkbook.totals.totalGeneral);
    document.getElementById("ready-summary-average").textContent = formatCurrency(readyWorkbook.totals.averageValue);

    document.getElementById("business-summary-active").textContent = formatInteger(businessCardWorkbook.totals.activeLines);
    document.getElementById("business-summary-quantity").textContent = formatInteger(businessCardWorkbook.totals.totalQuantity);
    document.getElementById("business-summary-total").textContent = formatCurrency(businessCardWorkbook.totals.totalGeneral);
    document.getElementById("business-summary-average").textContent = formatCurrency(businessCardWorkbook.totals.averageValue);

    document.getElementById("flyer-summary-active").textContent = formatInteger(flyerWorkbook.totals.activeLines);
    document.getElementById("flyer-summary-quantity").textContent = formatInteger(flyerWorkbook.totals.totalQuantity);
    document.getElementById("flyer-summary-total").textContent = formatCurrency(flyerWorkbook.totals.totalGeneral);
    document.getElementById("flyer-summary-average").textContent = formatCurrency(flyerWorkbook.totals.averageValue);

    document.getElementById("m2-summary-active").textContent = formatInteger(m2Workbook.totals.activeLines);
    document.getElementById("m2-summary-quantity").textContent = formatInteger(m2Workbook.totals.totalQuantity);
    document.getElementById("m2-summary-total").textContent = formatCurrency(m2Workbook.totals.totalGeneral);
    document.getElementById("m2-summary-average").textContent = formatCurrency(m2Workbook.totals.averageValue);

    document.getElementById("resin-summary-active").textContent = formatInteger(resinWorkbook.totals.activeLines);
    document.getElementById("resin-summary-quantity").textContent = formatInteger(resinWorkbook.totals.totalQuantity);
    document.getElementById("resin-summary-total").textContent = formatCurrency(resinWorkbook.totals.totalGeneral);
    document.getElementById("resin-summary-average").textContent = formatCurrency(resinWorkbook.totals.averageValue);
    setResinFeedback(resinWorkbook.message, resinWorkbook.tone || "neutral");

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
            <td><input class="cell-input" name="colorPages" type="number" min="0" step="1" value="${escapeHtml(row.colorPages ?? 0)}"></td>
            <td><select class="cell-select" name="coverType">${buildOptions(OPTIONS.coverTypes, row.coverType)}</select></td>
            <td><select class="cell-select" name="coverPaper">${buildOptions(OPTIONS.coverPapers, row.coverPaper)}</select></td>
            <td><select class="cell-select" name="backCoverType">${buildOptions(OPTIONS.backCoverTypes, row.backCoverType)}</select></td>
            <td><select class="cell-select" name="backCoverPaper">${buildOptions(OPTIONS.coverPapers, row.backCoverPaper)}</select></td>
            <td><select class="cell-select" name="spiralOption">${buildOptions(OPTIONS.spiralOptions, row.spiralOption)}</select></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.innerTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.coverTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.backTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.finishingTotal)}${row.groupedFinishing ? `<br><small>${row.bindingGroupLeader ? `Grupo ${escapeHtml(row.bindingGroup)}` : `Grupo ${escapeHtml(row.bindingGroup)} (na 1a linha)`}</small>` : ""}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
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
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `
      )
      .join("");

    credentialRowsTableBody.innerHTML = credentialWorkbook.rows
      .map(
        (row, index) => `
          <tr class="${row.active ? "" : "is-empty"}" data-credential-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}" placeholder="Ex.: Credencial evento"></td>
            <td><select class="cell-select" name="materialType">${buildOptions(OPTIONS.credentialMaterials, row.materialType)}</select></td>
            <td><select class="cell-select" name="printMode">${buildOptions(OPTIONS.printModes, row.printMode)}</select></td>
            <td><select class="cell-select" name="lamination">${buildOptions(OPTIONS.credentialLamination, row.lamination)}</select></td>
            <td>
              <div class="finish-picker">
                <button class="button finish-picker-button" type="button" data-credential-lanyard-toggle>
                  <span>${escapeHtml(row.lanyardLabel || "Sem cordão")}</span>
                  <span class="finish-picker-chevron">▾</span>
                </button>
              </div>
            </td>
            <td><input class="cell-input" name="widthCm" type="number" min="0" step="0.1" value="${escapeHtml(row.widthCm)}" placeholder="0,0"></td>
            <td><input class="cell-input" name="heightCm" type="number" min="0" step="0.1" value="${escapeHtml(row.heightCm)}" placeholder="0,0"></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}" placeholder="0"></td>
            <td><span class="readonly-value subtle">${formatAreaM2(row.areaM2)}</span></td>
            <td><span class="readonly-value subtle">${row.itemsPerSheet > 0 ? formatInteger(row.itemsPerSheet) : "-"}</span></td>
            <td><span class="readonly-value subtle">${row.sheetsNeeded > 0 ? formatInteger(row.sheetsNeeded) : "-"}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.baseTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.laminationTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.lanyardTotal)}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `
      )
      .join("");

    warningList.innerHTML = workbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("");
    colorWarningList.innerHTML = colorWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("");
    credentialWarningList.innerHTML = credentialWorkbook.warnings.length
      ? credentialWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Couche e offset puxam a base dos impressos coloridos. PS, laminação e cordões usam as bases já configuradas no sistema.</div>`;
    setCredentialFeedback(
      credentialWorkbook.activeRows.length > 0
        ? "Cálculo de credenciais atualizado com sucesso."
        : "Use esta aba para calcular várias credenciais no mesmo orçamento, reaproveitando os preços que já estão configurados no sistema.",
      credentialWorkbook.activeRows.length > 0 ? "success" : "neutral"
    );

    readyRowsTableBody.innerHTML = readyWorkbook.rows
      .map(
        (row, index) => `
          <tr class="${row.active ? "" : "is-empty"}" data-ready-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><select class="cell-select" name="productType">${buildReadyProductOptions(row.productType)}</select></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description === row.productLabel ? "" : row.description)}" placeholder="${escapeHtml(row.productLabel)}"></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}" placeholder="0"></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitPrice)}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
          </tr>
        `
      )
      .join("");

    readyWarningList.innerHTML = readyWorkbook.warnings.length
      ? readyWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Esta aba mistura cordões configuráveis com carimbos e acessórios prontos para venda.</div>`;
    setReadyFeedback(
      readyWorkbook.activeRows.length > 0
        ? "Produtos prontos atualizados com sucesso."
        : "Use esta aba para vender cordões, carimbos e outros itens prontos por unidade, separados da credencial.",
      readyWorkbook.activeRows.length > 0 ? "success" : "neutral"
    );

    businessCardRowsTableBody.innerHTML = businessCardWorkbook.rows
      .map((row, index) => {
        const material = getBusinessCardMaterial(row.materialId, row.productionType);
        return `
          <tr class="${row.active ? "" : "is-empty"}" data-business-card-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}" placeholder="Ex.: Cartão de visita"></td>
            <td><select class="cell-select" name="productionType">${buildOptions(OPTIONS.businessCardProductions, row.productionType)}</select></td>
            <td><select class="cell-select" name="materialId">${buildBusinessCardMaterialOptions(row.productionType, row.materialId)}</select></td>
            <td><select class="cell-select" name="printMode">${buildBusinessCardPrintModeOptions(material, row.printMode)}</select></td>
            <td><select class="cell-select" name="quantity">${buildBusinessCardQuantityOptions(material, row.printMode, row.quantity)}</select></td>
            <td><span class="readonly-value subtle">${escapeHtml(row.packageLabel || "-")}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.baseTotal)}</span></td>
            <td><select class="cell-select" name="extraFinish">${buildOptions(OPTIONS.businessCardExtraFinish, row.extraFinish)}</select></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.extraFinishTotal || 0)}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `;
      })
      .join("");

    businessCardWarningList.innerHTML = businessCardWorkbook.warnings.length
      ? businessCardWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Escolha a quantidade na lista para usar somente os pacotes cadastrados.</div>`;
    setBusinessCardFeedback(
      businessCardWorkbook.activeRows.length > 0
        ? "Cartões de visitas atualizados com sucesso."
        : "Use esta aba para orçar vários modelos de cartões de visita no mesmo orçamento.",
      businessCardWorkbook.activeRows.length > 0 ? "success" : "neutral"
    );

    flyerRowsTableBody.innerHTML = flyerWorkbook.rows
      .map((row, index) => {
        const item = getFlyerSelection(row.catalogId, row.productionType);
        return `
          <tr class="${row.active ? "" : "is-empty"}" data-flyer-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}" placeholder="Ex.: Folder promocional"></td>
            <td><select class="cell-select" name="productionType">${buildOptions(OPTIONS.flyerProductions, row.productionType)}</select></td>
            <td><select class="cell-select" name="catalogId">${buildFlyerCatalogOptions(row.productionType, row.catalogId)}</select></td>
            <td><span class="readonly-value subtle">${escapeHtml(row.size || item?.size || "-")}</span></td>
            <td><select class="cell-select" name="printMode">${buildFlyerPrintModeOptions(item, row.printMode)}</select></td>
            <td><select class="cell-select" name="quantity">${buildFlyerQuantityOptions(item, row.printMode, row.quantity)}</select></td>
            <td><select class="cell-select" name="foldType">${buildOptions(OPTIONS.flyerFolds, row.foldType)}</select></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.baseTotal)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.foldTotal)}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue)}</span></td>
          </tr>
        `;
      })
      .join("");

    flyerWarningList.innerHTML = flyerWorkbook.warnings.length
      ? flyerWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Escolha uma quantidade da tabela para fechar o valor.</div>`;
    setFlyerFeedback(
      flyerWorkbook.activeRows.length > 0
        ? "Panfletos e folders atualizados com sucesso."
        : "Use esta aba para orçar vários panfletos ou folders no mesmo orçamento.",
      flyerWorkbook.activeRows.length > 0 ? "success" : "neutral"
    );

    m2WarningList.innerHTML = m2Workbook.warnings.length
      ? m2Workbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Preencha as medidas e acabamentos para o app montar o valor final com segurança.</div>`;

    m2RowsTableBody.innerHTML = m2Workbook.rows
      .map(
        (row, index) => `
          <tr class="${row.active ? "" : "is-empty"}" data-m2-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td>
              <select class="cell-select" name="productId">
                ${m2Catalog.map((product) => `<option value="${escapeHtml(product.id)}"${product.id === row.productId ? " selected" : ""}>${escapeHtml(product.label)}</option>`).join("")}
              </select>
            </td>
            <td>
              ${createM2FinishPickerMarkup(row, config)}
            </td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}" placeholder="${escapeHtml(getDefaultM2Description(row.productId) || row.productLabel)}"></td>
            <td>
              <select class="cell-select" name="measureUnit">
                <option value="cm"${row.measureUnit === "cm" ? " selected" : ""}>cm</option>
                <option value="m"${row.measureUnit === "m" ? " selected" : ""}>m</option>
              </select>
            </td>
            <td><input class="cell-input" name="widthMm" type="number" min="0" step="0.1" value="${escapeHtml(row.widthMm)}" placeholder="0,0"></td>
            <td><input class="cell-input" name="heightMm" type="number" min="0" step="0.1" value="${escapeHtml(row.heightMm)}" placeholder="0,0"></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}" placeholder="0"></td>
            <td><span class="readonly-value subtle">${formatAreaM2(row.areaM2)}</span></td>
            <td><span class="readonly-value subtle">${escapeHtml(row.tierLabel)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.tierValue)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.configuredFinishExtraTotal || 0)}</span></td>
            <td><input class="cell-input" name="extraCharge" type="number" min="0" step="0.01" value="${escapeHtml(row.extraCharge ?? 0)}" placeholder="0,00"></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total)}</span></td>
          </tr>
        `
      )
      .join("");

    resinRowsTableBody.innerHTML = resinWorkbook.rows
      .map(
        (row, index) => `
          <tr class="${row.active ? "" : "is-empty"}" data-resin-row-index="${index}">
            <td><strong>${String(index + 1).padStart(2, "0")}</strong></td>
            <td><input class="cell-input description" name="description" value="${escapeHtml(row.description)}"></td>
            <td>
              <select class="cell-select" name="materialType">
                <option value="white"${row.materialType === "white" ? " selected" : ""}>Adesivo branco</option>
                <option value="transparent"${row.materialType === "transparent" ? " selected" : ""}>Adesivo transparente</option>
                <option value="holo-gold"${row.materialType === "holo-gold" ? " selected" : ""}>Adesivo holográfico dourado</option>
                <option value="holo-silver"${row.materialType === "holo-silver" ? " selected" : ""}>Adesivo holográfico prateado</option>
              </select>
            </td>
            <td><input class="cell-input" name="widthMm" type="number" min="0" step="0.01" value="${row.widthMm > 0 ? escapeHtml(row.widthMm / 10) : ""}" placeholder="0,0"></td>
            <td><input class="cell-input" name="heightMm" type="number" min="0" step="0.01" value="${row.heightMm > 0 ? escapeHtml(row.heightMm / 10) : ""}" placeholder="0,0"></td>
            <td><input class="cell-input" name="quantity" type="number" min="0" step="1" value="${escapeHtml(row.quantity)}" placeholder="0"></td>
            <td><span class="readonly-value subtle">${row.finalWidthMm > 0 && row.finalHeightMm > 0 ? `${formatResinMeasureCm(row.finalWidthMm)} x ${formatResinMeasureCm(row.finalHeightMm)} cm` : "-"}</span></td>
            <td><span class="readonly-value subtle">${escapeHtml(row.orientation || "-")}</span></td>
            <td><span class="readonly-value subtle">${formatInteger(row.piecesPerSheet || 0)}</span></td>
            <td><span class="readonly-value subtle">${formatInteger(row.sheetsNeeded || 0)}</span></td>
            <td><span class="readonly-value subtle">${formatInteger(row.producedQuantity || 0)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.sheetPrice || 0)}</span></td>
            <td><input class="cell-input" name="artCreationFee" type="number" min="0" step="0.01" value="${escapeHtml(row.artCreationFee ?? 0)}" placeholder="0,00"></td>
            <td><select class="cell-select" name="discountType">${buildOptions(["R$", "%"], row.discountType)}</select></td>
            <td><input class="cell-input" name="discountValue" type="number" min="0" step="0.01" value="${escapeHtml(row.discountValue ?? 0)}" placeholder="0,00"></td>
            <td><span class="readonly-value">${formatCurrency(row.total || 0)}</span></td>
            <td><span class="readonly-value subtle">${formatCurrency(row.unitValue || 0)}</span></td>
          </tr>
        `
      )
      .join("");

    resinWarningList.innerHTML = resinWorkbook.warnings.length
      ? resinWorkbook.warnings.map((warning) => `<div class="warning-item">${escapeHtml(warning)}</div>`).join("")
      : `<div class="warning-item is-success">Sem alertas no momento. Você pode montar várias medidas de resinados no mesmo orçamento por aqui.</div>`;

    quotePreview.innerHTML = createQuoteHtml(state, workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook);
    return { workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook };
  }

  function closeM2FinishPopover() {
    const existing = document.getElementById("m2-finish-popover");
    if (existing) {
      existing.remove();
    }
  }

  function closeCredentialLanyardPopover() {
    const existing = document.getElementById("credential-lanyard-popover");
    if (existing) {
      existing.remove();
    }
  }

  function closeBusinessCardQuantityPopover() {
    const existing = document.getElementById("business-card-quantity-popover");
    if (existing) {
      existing.remove();
    }
  }

  function openBusinessCardQuantityPopover(rowIndex, anchor) {
    const row = state.businessCardItems[rowIndex];
    if (!row || !anchor) {
      return;
    }

    closeBusinessCardQuantityPopover();

    const material = getBusinessCardMaterial(row.materialId, row.productionType);
    const printMode = getBusinessCardValidPrintMode(material, row.printMode);
    const options = getBusinessCardQuantityOptions(material, printMode);
    const selectedQuantity = toWholeNumber(row.quantity);
    const popover = document.createElement("div");
    popover.id = "business-card-quantity-popover";
    popover.className = "finish-popover";
    popover.innerHTML = `
      <div class="finish-popover-header">
        <div class="finish-popover-title">
          <strong>Quantidade de cartões</strong>
          <span>${escapeHtml(row.productionType)} | ${escapeHtml(material?.label || "")} | ${escapeHtml(printMode)}</span>
        </div>
        <button type="button" class="button finish-popover-close" data-business-card-quantity-close>Fechar</button>
      </div>
      <div class="finish-popover-list">
        ${options.length ? options.map((tier) => `
          <label class="finish-picker-option">
            <input type="radio" name="business-card-quantity-option" value="${escapeHtml(tier.quantity)}"${selectedQuantity === tier.quantity ? " checked" : ""} data-business-card-quantity-option>
            <span class="finish-option-copy">
              <span class="finish-option-label">${formatInteger(tier.quantity)} cartões</span>
              <small>${formatCurrency(tier.total)}</small>
            </span>
          </label>
        `).join("") : `<div class="empty-state"><strong>Sem tabela para esta combinação</strong><span>Troque o papel/acabamento ou o modo de impressão.</span></div>`}
      </div>
    `;

    document.body.appendChild(popover);
    const rect = anchor.getBoundingClientRect();
    popover.style.top = `${window.scrollY + rect.bottom + 8}px`;
    popover.style.left = `${Math.min(window.scrollX + rect.left, window.scrollX + window.innerWidth - popover.offsetWidth - 16)}px`;

    popover.addEventListener("change", (event) => {
      const option = event.target.closest("[data-business-card-quantity-option]");
      if (!option) {
        return;
      }
      row.quantity = toWholeNumber(option.value);
      persistLocalOnly();
      closeBusinessCardQuantityPopover();
      renderRowsAndSummary();
    });

    popover.addEventListener("click", (event) => {
      if (event.target.closest("[data-business-card-quantity-close]")) {
        closeBusinessCardQuantityPopover();
      }
    });
  }

  function openCredentialLanyardPopover(rowIndex, anchor) {
    const row = state.credentialItems[rowIndex];
    if (!row || !anchor) {
      return;
    }

    closeCredentialLanyardPopover();

    const quantity = toWholeNumber(row.quantity);
    const options = getCredentialLanyardOptions(config, quantity);
    const selected = getCredentialLanyardSelection(config, row.lanyardType, quantity);
    const popover = document.createElement("div");
    popover.id = "credential-lanyard-popover";
    popover.className = "finish-popover";
    popover.innerHTML = `
      <div class="finish-popover-header">
        <div class="finish-popover-title">
          <strong>Cordão da credencial</strong>
          <span>Escolha o modelo que será somado automaticamente ao valor desta linha.</span>
        </div>
        <button type="button" class="button finish-popover-close" data-credential-lanyard-close>Fechar</button>
      </div>
      <div class="finish-popover-list">
        ${options.map((option) => `
          <label class="finish-picker-option${option.id === "none" ? " is-none" : ""}">
            <input type="radio" name="credential-lanyard-option" value="${escapeHtml(option.id)}"${selected.id === option.id ? " checked" : ""} data-credential-lanyard-option>
            <div class="finish-picker-option-body">
              <div class="finish-option-copy">
                <span class="finish-option-label">${escapeHtml(option.label)}</span>
                <small>${escapeHtml(option.hint)}</small>
              </div>
            </div>
          </label>
        `).join("")}
      </div>
      <div class="finish-popover-footer">
        <span class="finish-popover-summary">${quantity > 0 ? `${formatInteger(quantity)} un na linha` : "Defina a quantidade para calcular a faixa certa"}</span>
        <button type="button" class="button finish-popover-clear" data-credential-lanyard-clear>Sem cordão</button>
      </div>
    `;

    document.body.appendChild(popover);

    const rect = anchor.getBoundingClientRect();
    popover.style.position = "fixed";
    popover.style.visibility = "hidden";
    popover.style.top = "12px";
    popover.style.left = "12px";
    const popoverRect = popover.getBoundingClientRect();
    const spacing = 12;
    const fitsBelow = rect.bottom + spacing + popoverRect.height <= window.innerHeight - spacing;
    const top = fitsBelow
      ? rect.bottom + spacing
      : Math.max(spacing, rect.top - popoverRect.height - spacing);
    const left = Math.min(
      Math.max(spacing, rect.left),
      Math.max(spacing, window.innerWidth - popoverRect.width - spacing)
    );
    popover.style.position = "fixed";
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.visibility = "visible";
    popover.dataset.rowIndex = String(rowIndex);

    popover.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement) || target.type !== "radio") {
        return;
      }
      row.lanyardType = target.value || "none";
      persistLocalOnly();
      renderRowsAndSummary();
      closeCredentialLanyardPopover();
    });

    popover.addEventListener("click", (event) => {
      if (event.target.closest("[data-credential-lanyard-close]")) {
        closeCredentialLanyardPopover();
        return;
      }
      if (event.target.closest("[data-credential-lanyard-clear]")) {
        row.lanyardType = "none";
        persistLocalOnly();
        renderRowsAndSummary();
        closeCredentialLanyardPopover();
      }
    });
  }

  function openM2FinishPopover(rowIndex, anchor) {
    const row = state.m2Items[rowIndex];
    if (!row || !anchor) {
      return;
    }

    closeM2FinishPopover();

    const finishes = Array.isArray(config.m2Finishes) ? config.m2Finishes : [];
    const selectedIds = Array.isArray(row.finishIds) ? row.finishIds : [];
    const selectedLabels = selectedIds
      .map((finishId) => finishes.find((finish) => finish.id === finishId)?.label)
      .filter(Boolean);
    const popover = document.createElement("div");
    popover.id = "m2-finish-popover";
    popover.className = "finish-popover";
    popover.innerHTML = `
      <div class="finish-popover-header">
        <div class="finish-popover-title">
          <strong>Acabamentos</strong>
          <span>Selecione um ou mais opcionais para este item.</span>
        </div>
        <button type="button" class="button finish-popover-close" data-finish-popover-close>Fechar</button>
      </div>
      <label class="finish-picker-option is-none finish-popover-empty">
        <input type="radio" name="m2-finish-none" value="none"${selectedIds.length === 0 ? " checked" : ""} data-finish-popover-option>
        <div class="finish-picker-option-body">
          <div class="finish-option-copy">
            <span class="finish-option-label">Sem acabamento</span>
            <small>Use esta opção quando o item não tiver nenhum adicional de produção.</small>
          </div>
        </div>
      </label>
      <div class="finish-popover-list">
        ${finishes.map((finish) => {
          const checked = selectedIds.includes(finish.id);
          const isEyelet = finish.type === "eyelet";
          const overrideValue = row.finishOverrides?.[finish.id];
          const finishHint = isEyelet
            ? "Calculado pela quantidade de ilhós, com espaçamento automático ou quantidade manual."
            : finish.type === "perimeter"
              ? "Calculado pelo perímetro total da peça."
              : "Calculado pela área total em m².";
          return `
          <label class="finish-picker-option">
            <input type="checkbox" value="${escapeHtml(finish.id)}"${checked ? " checked" : ""} data-finish-popover-option data-finish-id="${escapeHtml(finish.id)}">
            <div class="finish-picker-option-body">
              <div class="finish-option-copy">
                <span class="finish-option-label">${escapeHtml(finish.label)}</span>
                <small>${escapeHtml(finishHint)}</small>
              </div>
              ${isEyelet ? `
                <div class="finish-eyelet-settings"${checked ? "" : " hidden"}>
                  <span>Espaçamento</span>
                  <input type="number" min="1" step="1" value="${escapeHtml(finish.spacingCm || 20)}" data-finish-spacing-id="${escapeHtml(finish.id)}">
                  <span>cm</span>
                </div>
                <div class="finish-eyelet-settings"${checked ? "" : " hidden"}>
                  <span>Qtd. manual</span>
                  <input type="number" min="0" step="1" value="${overrideValue > 0 ? escapeHtml(overrideValue) : ""}" placeholder="Auto" data-finish-override-id="${escapeHtml(finish.id)}">
                  <span>ilhós</span>
                </div>
              ` : ""}
            </div>
          </label>
        `;}).join("")}
      </div>
      <div class="finish-popover-footer">
        <span class="finish-popover-summary">${escapeHtml(selectedLabels.length ? `${selectedLabels.length} selecionado(s)` : "Nenhum acabamento selecionado")}</span>
        <button type="button" class="button finish-popover-clear" data-finish-popover-clear>Limpar seleção</button>
      </div>
    `;

    document.body.appendChild(popover);

    const rect = anchor.getBoundingClientRect();
    popover.style.position = "fixed";
    popover.style.visibility = "hidden";
    popover.style.top = "12px";
    popover.style.left = "12px";
    const popoverRect = popover.getBoundingClientRect();
    const spacing = 12;
    const fitsBelow = rect.bottom + spacing + popoverRect.height <= window.innerHeight - spacing;
    const top = fitsBelow
      ? rect.bottom + spacing
      : Math.max(spacing, rect.top - popoverRect.height - spacing);
    const left = Math.min(
      Math.max(spacing, rect.left),
      Math.max(spacing, window.innerWidth - popoverRect.width - spacing)
    );
    popover.style.position = "fixed";
    popover.style.top = `${top}px`;
    popover.style.left = `${left}px`;
    popover.style.visibility = "visible";
    popover.dataset.rowIndex = String(rowIndex);

    const syncSelection = () => {
      const checked = Array.from(popover.querySelectorAll('input[type="checkbox"][data-finish-popover-option]:checked')).map((input) => input.value);
      row.finishIds = checked;
      persist();
      renderRowsAndSummary();
    };

    popover.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      if (target.type === "radio" && target.value === "none") {
        row.finishIds = [];
        persist();
        renderRowsAndSummary();
        closeM2FinishPopover();
        return;
      }

      if (target.type === "checkbox") {
        const noneRadio = popover.querySelector('input[type="radio"][value="none"]');
        if (noneRadio) {
          noneRadio.checked = false;
        }
        const rowLabel = target.closest(".finish-picker-option");
        rowLabel?.querySelectorAll(".finish-eyelet-settings").forEach((item) => {
          item.hidden = !target.checked;
        });
        const hasAny = Array.from(popover.querySelectorAll('input[type="checkbox"][data-finish-popover-option]')).some((input) => input.checked);
        if (!hasAny && noneRadio) {
          noneRadio.checked = true;
        }
        syncSelection();
        return;
      }

      if (target.type === "number" && target.dataset.finishSpacingId) {
        const finish = config.m2Finishes.find((item) => item.id === target.dataset.finishSpacingId);
        if (finish) {
          finish.spacingCm = toWholeNumber(target.value);
          persist();
          renderRowsAndSummary();
        }
        return;
      }

      if (target.type === "number" && target.dataset.finishOverrideId) {
        const finishId = target.dataset.finishOverrideId;
        if (!row.finishOverrides || typeof row.finishOverrides !== "object") {
          row.finishOverrides = {};
        }
        const rawValue = String(target.value || "").trim();
        if (!rawValue) {
          delete row.finishOverrides[finishId];
        } else {
          const overrideValue = toWholeNumber(rawValue);
          if (overrideValue > 0) {
            row.finishOverrides[finishId] = overrideValue;
          } else {
            delete row.finishOverrides[finishId];
          }
        }
        persist();
        renderRowsAndSummary();
      }
    });

    popover.addEventListener("click", (event) => {
      if (event.target.closest("[data-finish-popover-close]")) {
        closeM2FinishPopover();
        return;
      }

      if (event.target.closest("[data-finish-popover-clear]")) {
        row.finishIds = [];
        persist();
        renderRowsAndSummary();
        closeM2FinishPopover();
      }
    });
  }

  function renderAll() {
    renderPresetControls();
    renderClientFields();
    renderConfig();
    renderClientsTab();
    renderHistoryTab();
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
      setMainFeedback("Nenhum PDF válido foi selecionado. Escolha um ou mais arquivos em PDF para preencher as linhas automaticamente.", "warning");
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
      row.colorPages = 0;
      imported += 1;
    }

    persist();
    renderRowsAndSummary();
      setMainFeedback(`${imported} PDF(s) importado(s) com sucesso. Se a contagem de páginas de algum arquivo vier diferente, você pode corrigir direto na linha.`, "success");
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      selectTab(button.dataset.tabTarget);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const target = event.target;
    if (!shouldUseCustomTabOrder(target)) {
      return;
    }

    const activePanel = getActiveTabPanel();
    if (!activePanel || !activePanel.contains(target)) {
      return;
    }

    const editableElements = getCustomTabOrderElements(activePanel);
    if (editableElements.length < 2) {
      return;
    }

    const currentIndex = editableElements.indexOf(target);
    if (currentIndex === -1) {
      return;
    }

    event.preventDefault();
    const direction = event.shiftKey ? -1 : 1;
    const nextIndex = (currentIndex + direction + editableElements.length) % editableElements.length;
    editableElements[nextIndex]?.focus();
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

  document.getElementById("add-credential-row-button").addEventListener("click", () => {
    state.credentialItems.push(createDefaultCredentialRow(state.credentialItems.length));
    persistLocalOnly();
    renderRowsAndSummary();
  });

  document.getElementById("add-ready-row-button").addEventListener("click", () => {
    state.readyProductItems.push(createDefaultReadyProductRow(state.readyProductItems.length));
    persistLocalOnly();
    renderRowsAndSummary();
  });

  document.getElementById("add-business-card-row-button").addEventListener("click", () => {
    state.businessCardItems.push(createDefaultBusinessCardRow(state.businessCardItems.length));
    persistLocalOnly();
    renderRowsAndSummary();
  });

  document.getElementById("add-flyer-row-button").addEventListener("click", () => {
    state.flyerItems.push(createDefaultFlyerRow(state.flyerItems.length));
    persistLocalOnly();
    renderRowsAndSummary();
  });

  document.getElementById("add-m2-row-button").addEventListener("click", () => {
    state.m2Items.push(createDefaultM2Row(state.m2Items.length));
    persist();
    renderRowsAndSummary();
  });

  document.getElementById("add-resin-row-button").addEventListener("click", () => {
    state.resinItems.push(createDefaultResinRow(state.resinItems.length));
    persistLocalOnly();
    renderRowsAndSummary();
  });

  document.getElementById("clear-all-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar linhas de apostila",
      message: "Deseja realmente limpar todas as linhas da aba de cálculo de apostila?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setMainFeedback("A limpeza das linhas de apostila foi cancelada.", "warning");
      return;
    }
    selectedRowIds.clear();
    state.rows = Array.from({ length: 5 }, (_, index) => createDefaultRow(index));
    persist();
    renderRowsAndSummary();
    setMainFeedback("As linhas de cálculo de apostila foram limpas.", "warning");
  });

  document.getElementById("clear-color-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar impressos coloridos",
      message: "Deseja realmente limpar todas as linhas da aba de impressos coloridos?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setColorFeedback("A limpeza dos impressos coloridos foi cancelada.", "warning");
      return;
    }
    state.colorPrintItems = Array.from({ length: 5 }, (_, index) => createDefaultColorPrintRow(index));
    persist();
    renderRowsAndSummary();
    setColorFeedback("As linhas de impressos coloridos foram limpas.", "warning");
  });

  document.getElementById("clear-credential-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar credenciais",
      message: "Deseja realmente limpar todas as linhas da aba de credenciais?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setCredentialFeedback("A limpeza das credenciais foi cancelada.", "warning");
      return;
    }
    state.credentialItems = Array.from({ length: 5 }, (_, index) => createDefaultCredentialRow(index));
    persistLocalOnly();
    renderRowsAndSummary();
    setCredentialFeedback("As linhas de credenciais foram limpas.", "warning");
  });

  document.getElementById("clear-ready-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar produtos prontos",
      message: "Deseja realmente limpar todas as linhas da aba de produtos prontos?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setReadyFeedback("A limpeza dos produtos prontos foi cancelada.", "warning");
      return;
    }
    state.readyProductItems = Array.from({ length: 5 }, (_, index) => createDefaultReadyProductRow(index));
    persistLocalOnly();
    renderRowsAndSummary();
    setReadyFeedback("As linhas de produtos prontos foram limpas.", "warning");
  });

  document.getElementById("clear-business-card-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar cartões de visitas",
      message: "Deseja realmente limpar todas as linhas da aba de cartões de visitas?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setBusinessCardFeedback("A limpeza dos cartões foi cancelada.", "warning");
      return;
    }
    state.businessCardItems = Array.from({ length: 5 }, (_, index) => createDefaultBusinessCardRow(index));
    persistLocalOnly();
    renderRowsAndSummary();
    setBusinessCardFeedback("As linhas de cartões de visitas foram limpas.", "warning");
  });

  document.getElementById("clear-flyer-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar panfletos e folders",
      message: "Deseja realmente limpar todas as linhas da aba de panfletos e folders?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setFlyerFeedback("A limpeza dos panfletos e folders foi cancelada.", "warning");
      return;
    }
    state.flyerItems = Array.from({ length: 5 }, (_, index) => createDefaultFlyerRow(index));
    persistLocalOnly();
    renderRowsAndSummary();
    setFlyerFeedback("As linhas de panfletos e folders foram limpas.", "warning");
  });

  document.getElementById("clear-m2-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar cálculo de m²",
      message: "Deseja realmente limpar todas as linhas da aba de cálculo de m²?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setConfigStatus("Limpeza cancelada.", "warning");
      return;
    }
    state.m2Items = Array.from({ length: 5 }, (_, index) => createDefaultM2Row(index));
    persist();
    renderRowsAndSummary();
    setConfigStatus("Linhas de cálculo de m² limpas.", "warning");
  });

  document.getElementById("clear-resin-rows-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Limpeza",
      title: "Limpar resinados",
      message: "Deseja realmente limpar todas as linhas da aba de resinados?",
      confirmLabel: "Limpar",
      danger: true,
    }))) {
      setResinFeedback("A limpeza dos resinados foi cancelada.", "warning");
      return;
    }
    state.resinItems = Array.from({ length: 5 }, (_, index) => createDefaultResinRow(index));
    persistLocalOnly();
    renderRowsAndSummary();
    setResinFeedback("As linhas de resinados foram limpas.", "warning");
  });

  document.getElementById("calc-mode-select").addEventListener("change", (event) => {
    state.calcMode = event.target.value;
    persist();
    renderRowsAndSummary();
  });

  document.getElementById("m2-calc-mode-select").addEventListener("change", (event) => {
    state.m2CalcMode = OPTIONS.m2CalcModes.includes(event.target.value) ? event.target.value : "Independente";
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
    if (field === "quantity" || field === "pages" || field === "colorPages") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }
    persist();
    renderRowsAndSummary();
  });

  resinRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-resin-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.resinItems[Number(rowElement.dataset.resinRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }
    if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "widthMm" || field === "heightMm") {
      row[field] = toDecimalNumber(target.value) * 10;
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }
    persistLocalOnly();
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
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }

    persist();
    renderRowsAndSummary();
  });

  credentialRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-credential-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.credentialItems[Number(rowElement.dataset.credentialRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }
    if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "widthCm" || field === "heightCm") {
      row[field] = toDecimalNumber(target.value);
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }
    persistLocalOnly();
    renderRowsAndSummary();
  });

  readyRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-ready-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.readyProductItems[Number(rowElement.dataset.readyRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }
    if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }
    persistLocalOnly();
    renderRowsAndSummary();
  });

  businessCardRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-business-card-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.businessCardItems[Number(rowElement.dataset.businessCardRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }

    if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else if (field === "productionType") {
      row.productionType = OPTIONS.businessCardProductions.includes(target.value) ? target.value : "Laser";
      const material = getBusinessCardMaterials(row.productionType)[0];
      row.materialId = material?.id || "";
      row.printMode = getBusinessCardValidPrintMode(material, row.printMode);
      normalizeBusinessCardRowChoice(row);
    } else if (field === "materialId") {
      const material = getBusinessCardMaterial(target.value, row.productionType);
      row.materialId = material?.id || "";
      row.printMode = getBusinessCardValidPrintMode(material, row.printMode);
      normalizeBusinessCardRowChoice(row);
    } else if (field === "printMode") {
      const material = getBusinessCardMaterial(row.materialId, row.productionType);
      row.printMode = getBusinessCardValidPrintMode(material, target.value);
      normalizeBusinessCardRowChoice(row);
    } else {
      row[field] = target.value;
    }
    persistLocalOnly();
    renderRowsAndSummary();
  });

  flyerRowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-flyer-row-index]");
    if (!rowElement) {
      return;
    }
    const row = state.flyerItems[Number(rowElement.dataset.flyerRowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }

    if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "artCreationFee" || field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else if (field === "productionType") {
      row.productionType = OPTIONS.flyerProductions.includes(target.value) ? target.value : "Laser";
      row.catalogId = getFlyerCatalogByProduction(row.productionType)[0]?.id || "";
      normalizeFlyerRowChoice(row);
    } else if (field === "catalogId") {
      row.catalogId = target.value;
      normalizeFlyerRowChoice(row);
    } else if (field === "printMode") {
      const item = getFlyerSelection(row.catalogId, row.productionType);
      row.printMode = getFlyerValidPrintMode(item, target.value);
      normalizeFlyerRowChoice(row);
    } else if (field === "foldType") {
      row.foldType = OPTIONS.flyerFolds.includes(target.value) ? target.value : "Sem dobra";
    } else {
      row[field] = target.value;
    }

    persistLocalOnly();
    renderRowsAndSummary();
  });

  credentialRowsTableBody.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-credential-lanyard-toggle]");
    if (!toggle) {
      return;
    }
    event.preventDefault();
    const rowElement = toggle.closest("tr[data-credential-row-index]");
    if (!rowElement) {
      return;
    }
    openCredentialLanyardPopover(Number(rowElement.dataset.credentialRowIndex), toggle);
  });

  m2RowsTableBody.addEventListener("change", (event) => {
    const target = event.target;
    const rowElement = target.closest("tr[data-m2-row-index]");
    if (!rowElement) {
      return;
    }

    const row = state.m2Items[Number(rowElement.dataset.m2RowIndex)];
    const field = target.name;
    if (!field || !row) {
      return;
    }

    if (field === "productId") {
      const previousProductId = row.productId;
      const previousDefaultDescription = getDefaultM2Description(previousProductId);
      const currentDescription = (row.description || "").trim();
      row.productId = target.value;
      const nextDefaultDescription = getDefaultM2Description(row.productId);
      if (!currentDescription || currentDescription === previousDefaultDescription) {
        row.description = nextDefaultDescription;
      }
    } else if (field === "widthMm" || field === "heightMm") {
      row[field] = toDecimalNumber(target.value);
    } else if (field === "measureUnit") {
      row.measureUnit = target.value === "m" ? "m" : "cm";
    } else if (field === "quantity") {
      row[field] = toWholeNumber(target.value);
    } else if (field === "extraCharge" || field === "artCreationFee" || field === "finishingExtra") {
      if (field === "finishingExtra") {
        row.extraCharge = toMoneyNumber(target.value);
      } else {
        row[field] = toMoneyNumber(target.value);
      }
    } else if (field === "discountValue") {
      row[field] = toMoneyNumber(target.value);
    } else if (field === "discountType") {
      row[field] = normalizeDiscountType(target.value);
    } else {
      row[field] = target.value;
    }

    persist();
    renderRowsAndSummary();
  });

  m2RowsTableBody.addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-finish-picker-toggle]");
    if (toggle) {
      event.preventDefault();
      const rowElement = toggle.closest("tr[data-m2-row-index]");
      if (!rowElement) {
        return;
      }
      openM2FinishPopover(Number(rowElement.dataset.m2RowIndex), toggle);
      return;
    }
  });

  document.addEventListener("click", (event) => {
    if (
      event.target.closest("[data-finish-picker-toggle]")
      || event.target.closest("#m2-finish-popover")
      || event.target.closest("[data-credential-lanyard-toggle]")
      || event.target.closest("#credential-lanyard-popover")
      || event.target.closest("[data-business-card-quantity-toggle]")
      || event.target.closest("#business-card-quantity-popover")
    ) {
      return;
    }
    closeM2FinishPopover();
    closeCredentialLanyardPopover();
    closeBusinessCardQuantityPopover();
  });

  document.getElementById("apply-group-selected").addEventListener("click", () => {
    const groupName = normalizeBindingGroup(document.getElementById("group-name-input").value);
    if (!groupName) {
      setMainFeedback("Digite um nome de grupo antes de aplicar o acabamento em lote.", "warning");
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
    setMainFeedback(changed > 0 ? `Grupo ${groupName} aplicado em ${changed} linha(s).` : "Selecione pelo menos uma linha para aplicar o grupo.", changed > 0 ? "success" : "warning");
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
    setMainFeedback(changed > 0 ? `Grupo removido de ${changed} linha(s).` : "Selecione pelo menos uma linha para remover o grupo.", changed > 0 ? "success" : "warning");
  });

  spiralDiscountInput.addEventListener("input", (event) => {
    if (!isConfigUnlocked) {
      event.target.value = config.spiralPlasticDiscount;
      return;
    }
    config.spiralPlasticDiscount = toMoneyNumber(event.target.value);
    persist();
    renderRowsAndSummary();
    setConfigStatus("Desconto da espiral atualizado.", "success");
  });

  configSections.addEventListener("submit", (event) => {
    if (event.target.id !== "config-lock-form") {
      return;
    }

    event.preventDefault();
    const passwordInput = document.getElementById("config-password-input");
    unlockConfiguration(passwordInput?.value || "");
    if (passwordInput) {
      passwordInput.value = "";
    }
  });

  configSections.addEventListener("input", (event) => {
    if (!isConfigUnlocked) {
      return;
    }

    const target = event.target;
    const prefix = target.dataset.configPrefix;
    const rowIndex = Number(target.dataset.configRow);
    const key = target.dataset.configKey;
    const catalogProductTab = target.dataset.catalogProductTab;
    const catalogProductIndex = Number(target.dataset.catalogProductIndex);
    const catalogProductKey = target.dataset.catalogProductKey;
    if (!prefix || !key) {
      if (catalogProductTab && catalogProductKey && Number.isFinite(catalogProductIndex)) {
        const product = config.catalogSections.filter((item) => item?.tab === catalogProductTab)[catalogProductIndex];
        if (!product) {
          return;
        }
        const previousId = product.id;
        if (catalogProductKey === "bleedMm") {
          product[catalogProductKey] = toDecimalNumber(target.value);
        } else {
          product[catalogProductKey] = target.value;
        }
        if (catalogProductKey === "id" && catalogProductTab === "m2" && previousId && product.id && previousId !== product.id) {
          state.m2Items.forEach((row) => {
            if (row.productId === previousId) {
              row.productId = product.id;
            }
          });
        }
        persist();
        renderRowsAndSummary();
        setConfigStatus("Produto extra atualizado.", "success");
      }
      return;
    }

    if (prefix === "m2-finish") {
      const finish = config.m2Finishes?.[rowIndex];
      if (!finish) {
        return;
      }
      if (key === "spacingCm") {
        finish[key] = toWholeNumber(target.value);
      } else if (key === "price") {
        finish[key] = toMoneyNumber(target.value);
      } else {
        finish[key] = target.value;
      }
      persist();
      renderRowsAndSummary();
      setConfigStatus("Acabamento de m² atualizado.", "success");
      return;
    }

    if (prefix === "credential-lanyard-fixed") {
      if (!config.credentialLanyardPricing) {
        return;
      }
      config.credentialLanyardPricing[key] = toMoneyNumber(target.value);
      persist();
      renderRowsAndSummary();
      setConfigStatus("Preço de cordão atualizado.", "success");
      return;
    }

    if (prefix === "resin") {
      if (key === "minimumOrderPrice" || key === "markupPercent") {
        config.resinPricing[key] = toMoneyNumber(target.value);
      } else {
        const match = key.match(/^(standard|special)-(tier1|tier2|tier5|tier10)$/);
        if (!match) {
          return;
        }
        const [, group, tierKey] = match;
        config.resinPricing.pricingByMaterial[group][tierKey] = toMoneyNumber(target.value);
      }
      persist();
      renderRowsAndSummary();
      setConfigStatus("Tabela de resinados atualizada.", "success");
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
    } else if (prefix.startsWith("m2-")) {
      if (key === "min") {
        array[rowIndex][key] = toDecimalNumber(target.value);
      } else if (key === "value") {
        array[rowIndex][key] = toMoneyNumber(target.value);
      } else {
        array[rowIndex][key] = target.value;
      }
    } else if (key === "min" || key === "maxSheets" || key === "quantity") {
      array[rowIndex][key] = toWholeNumber(target.value);
    } else if (key === "minUp") {
      array[rowIndex][key] = toWholeNumber(target.value);
    } else if (key === "value" || key === "total") {
      array[rowIndex][key] = toMoneyNumber(target.value);
    } else {
      array[rowIndex][key] = target.value;
    }

    persist();
    renderRowsAndSummary();
    setConfigStatus("Preço atualizado.", "success");
  });

  configSections.addEventListener("click", async (event) => {
    if (!isConfigUnlocked) {
      return;
    }

    const modeButton = event.target.closest("[data-config-view-mode]");
    if (modeButton) {
      configViewMode = modeButton.dataset.configViewMode === "advanced" ? "advanced" : "basic";
      saveConfigViewMode(configViewMode);
      renderConfig();
      setConfigStatus(
        configViewMode === "advanced"
          ? "Modo avançado ativado."
          : "Modo iniciante ativado.",
        "success"
      );
      return;
    }

    const sectionButton = event.target.closest("[data-config-section]");
    if (sectionButton) {
      activeConfigSection = sectionButton.dataset.configSection === "impressos" || sectionButton.dataset.configSection === "credenciais" || sectionButton.dataset.configSection === "produtos-prontos" || sectionButton.dataset.configSection === "cartoes" || sectionButton.dataset.configSection === "panfletos" || sectionButton.dataset.configSection === "m2" || sectionButton.dataset.configSection === "resinados"
        ? sectionButton.dataset.configSection
        : "calculo";
      saveConfigSection(activeConfigSection);
      renderConfig();
      setConfigStatus("Seção da configuração atualizada.", "success");
      return;
    }

    const deleteButton = event.target.closest("[data-config-delete]");
    if (deleteButton) {
      const deleteType = deleteButton.dataset.configDelete;
      if (deleteType === "config-row") {
        const prefix = deleteButton.dataset.configPrefix;
        const rowIndex = Number(deleteButton.dataset.configRow);
        if (!(await confirmConfigDelete("Deseja realmente excluir esta faixa de preço?"))) {
          setConfigStatus("Exclusão cancelada.", "warning");
          return;
        }
        if (removeConfigRow(prefix, rowIndex)) {
          persist();
          renderConfig();
          renderRowsAndSummary();
          setConfigStatus("Faixa excluída com sucesso.", "warning");
        }
        return;
      }

      if (deleteType === "m2-finish") {
        const rowIndex = Number(deleteButton.dataset.finishRow);
        if (!(await confirmConfigDelete("Deseja realmente excluir este acabamento de m²?"))) {
          setConfigStatus("Exclusão cancelada.", "warning");
          return;
        }
        if (removeM2Finish(rowIndex)) {
          persist();
          renderConfig();
          renderRowsAndSummary();
          setConfigStatus("Acabamento excluído com sucesso.", "warning");
        }
        return;
      }

      if (deleteType === "catalog-product") {
        const tab = deleteButton.dataset.catalogTab;
        const rowIndex = Number(deleteButton.dataset.catalogIndex);
        if (!(await confirmConfigDelete("Deseja realmente excluir este produto extra?"))) {
          setConfigStatus("Exclusão cancelada.", "warning");
          return;
        }
        if (removeCatalogProduct(tab, rowIndex)) {
          persist();
          renderConfig();
          renderRowsAndSummary();
          setConfigStatus("Produto extra excluído com sucesso.", "warning");
        }
        return;
      }
    }

    const button = event.target.closest("[data-add-m2-pricing]");
    if (!button) {
      const addBandButton = event.target.closest("[data-add-m2-band]");
      if (addBandButton) {
        const pricingKey = addBandButton.dataset.addM2Band;
        if (!pricingKey) {
          return;
        }
        const bands = config.m2Pricing[pricingKey] || (config.m2Pricing[pricingKey] = []);
        const lastBand = bands[bands.length - 1] || { min: 0, value: 0, label: "Nova faixa" };
        bands.push({
          min: Number(lastBand.min || 0) + 1,
          value: Number(lastBand.value || 0),
          label: lastBand.label ? `acima de ${lastBand.min || 0} m²` : "nova faixa",
        });
        persist();
        renderConfig();
        setConfigStatus("Nova faixa criada para este produto.", "success");
        return;
      }

      const addFinishButton = event.target.closest("[data-add-m2-finish]");
      if (addFinishButton) {
        config.m2Finishes.push({
          id: `acabamento-${Date.now()}`,
          label: "Novo acabamento",
          type: "area",
          price: 0,
          spacingCm: 20,
        });
        persist();
        renderConfig();
        setConfigStatus("Novo acabamento criado.", "success");
        return;
      }

    const addCredentialLanyardBandButton = event.target.closest("[data-add-credential-lanyard-band]");
    if (addCredentialLanyardBandButton) {
        const bands = config.credentialLanyardPricing?.printedPackages || (config.credentialLanyardPricing.printedPackages = []);
        const lastBand = bands[bands.length - 1] || { quantity: 0, total: 0, label: "Novo pacote" };
        const nextQuantity = Number(lastBand.quantity || 0) + 10;
        bands.push({
          quantity: nextQuantity,
          total: Number(lastBand.total || 0),
          label: `${nextQuantity} un`,
        });
        persist();
        renderConfig();
        setConfigStatus("Novo pacote criado para cordão estampado.", "success");
        return;
      }

      const addProductButton = event.target.closest("[data-add-catalog-product]");
      if (addProductButton) {
        const tab = addProductButton.dataset.addCatalogProduct;
        if (!tab) {
          return;
        }
        const sectionProducts = config.catalogSections.filter((item) => item?.tab === tab);
        const existingKeys = new Set(Object.keys(config.m2Pricing || {}));
        const newPricingKey = tab === "m2" ? createUniqueM2PricingKey("lona", existingKeys) : "";
        config.catalogSections.push({
          id: `produto-${Date.now()}`,
          label: "Novo produto",
          tab,
          pricingKey: newPricingKey,
          note: "",
        });
        if (tab === "m2") {
          config.m2Pricing[newPricingKey] = deepClone(config.m2Pricing.banner || []);
        }
        persist();
        renderConfig();
        setConfigStatus("Novo produto extra criado.", "success");
      }
      return;
    }

    const configKey = button.dataset.addM2Pricing;
    const bands = config.m2Pricing?.[configKey];
    if (!Array.isArray(bands)) {
      return;
    }

    const lastBand = bands[bands.length - 1] || { min: 0, value: 0 };
    const lastMin = Number(lastBand.min || 0);
    const nextMin = lastMin >= 1000000 ? 1000000 : lastMin + 1;
    bands.push({
      min: nextMin,
      value: Number(lastBand.value || 0),
      label: lastMin >= 1000000 ? "nova faixa" : `acima de ${lastMin} m²`,
    });

    persist();
    renderAll();
    setConfigStatus("Nova faixa de preço adicionada.", "success");
  });

  document.getElementById("save-config-button").addEventListener("click", () => {
    saveConfiguration();
  });

  lockConfigButton.addEventListener("click", () => {
    lockConfiguration();
  });

  document.getElementById("reset-config-button").addEventListener("click", async () => {
    if (!(await confirmAppAction({
      kicker: "Restauração",
      title: "Restaurar configuração padrão",
      message: "Deseja realmente restaurar os preços e ajustes originais da configuração?",
      confirmLabel: "Restaurar",
      danger: true,
    }))) {
      setConfigStatus("Restauração cancelada.", "warning");
      return;
    }
    const reset = createDefaultConfig();
    Object.assign(config, reset);
    persist();
    renderAll();
    setConfigStatus("Configuração restaurada para o padrão.", "warning");
  });

  document.getElementById("export-config-button").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "configuracao-graficalc.json";
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
      setMainFeedback("Configuração importada com sucesso. Os novos valores já foram aplicados ao app.", "success");
      setConfigStatus("Configuração importada com sucesso.", "success");
    } catch {
      setMainFeedback("Não foi possível ler esse arquivo de configuração. Confira se o arquivo está em JSON válido.", "error");
      setConfigStatus("Não foi possível importar esse arquivo de configuração.", "error");
    }

    event.target.value = "";
  });

  [
    ["client-name", "client", "name"],
    ["client-contact", "client", "contact"],
    ["client-cnpj", "client", "cnpj"],
    ["payment-terms", null, "paymentTerms"],
    ["production-deadline", null, "productionDeadline"],
    ["quote-discount-type", null, "quoteDiscountType"],
    ["quote-discount-value", null, "quoteDiscountValue"],
    ["quote-notes", null, "quoteNotes"],
    ["company-name", "company", "name"],
    ["company-cnpj", "company", "cnpj"],
    ["company-contact", "company", "contact"],
    ["company-address", "company", "address"],
  ].forEach(([elementId, section, field]) => {
    const element = document.getElementById(elementId);
    const updateField = (event) => {
      if (section) {
        state[section][field] = event.target.value;
      } else if (field === "quoteDiscountValue") {
        state[field] = toMoneyNumber(event.target.value);
      } else if (field === "quoteDiscountType") {
        state[field] = normalizeDiscountType(event.target.value);
      } else {
        state[field] = event.target.value;
      }
      persist();
      renderRowsAndSummary();
    };
    element.addEventListener("input", updateField);
    if (element.tagName === "SELECT") {
      element.addEventListener("change", updateField);
    }
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
    const credentialWorkbook = calculateCredentialWorkbook(state, config);
    const readyWorkbook = calculateReadyProductWorkbook(state, config);
    const businessCardWorkbook = calculateBusinessCardWorkbook(state);
    const flyerWorkbook = calculateFlyerWorkbook(state);
    const m2Workbook = calculateM2WorkbookFromConfig(state, config);
    const resinWorkbook = calculateResinWorkbook(state, config);
    const text = createQuoteText(state, workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook);
    try {
      await navigator.clipboard.writeText(text);
      setMainFeedback("Resumo do orçamento copiado com sucesso.", "success");
    } catch {
      setMainFeedback("Não foi possível copiar automaticamente, mas a prévia continua disponível na tela para conferência.", "warning");
    }
  });

  document.getElementById("print-quote-button").addEventListener("click", () => {
    const previousTitle = document.title;
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restoreTitle);
    };

    document.title = buildQuoteDocumentTitle();
    window.addEventListener("afterprint", restoreTitle);
    selectTab("orcamento");
    window.print();
    setTimeout(restoreTitle, 1000);
  });

  document.getElementById("save-client-button").addEventListener("click", () => {
    const formValues = readClientRecordForm();
    const clientName = formValues.name;
    if (!clientName) {
      setClientsFeedback("Digite o nome do contato antes de salvar.", "warning");
      return;
    }

    const existingIndex = state.clients.findIndex((client) =>
      activeClientEditorId ? client.id === activeClientEditorId : client.name.trim().toLowerCase() === clientName.toLowerCase()
    );
    const payload = {
      id: existingIndex >= 0 ? state.clients[existingIndex].id : `client-${Date.now()}`,
      ...formValues,
      createdAt: existingIndex >= 0 ? state.clients[existingIndex].createdAt : new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      state.clients[existingIndex] = payload;
    } else {
      state.clients.unshift(payload);
    }

    activeClientEditorId = payload.id;
    fillClientRecordForm(payload);
    persist();
    renderClientsTab();
    setClientsFeedback(existingIndex >= 0 ? "Contato atualizado com sucesso." : "Contato salvo com sucesso.", "success");
  });

  document.getElementById("new-client-button").addEventListener("click", () => {
    resetClientRecordForm();
    setClientsFeedback("Formulário limpo para cadastrar um novo contato.", "success");
  });

  document.getElementById("load-current-client-button").addEventListener("click", () => {
    activeClientEditorId = "";
    fillClientRecordForm({
      name: state.client.name,
      contact: state.client.contact,
      cnpj: state.client.cnpj,
      notes: state.quoteNotes,
    });
    setClientsFeedback("Dados do orçamento atual carregados no formulário. Agora é só salvar o contato.", "success");
  });

  document.getElementById("save-history-button").addEventListener("click", () => {
    const workbook = calculateWorkbook(state, config);
    const colorWorkbook = calculateColorPrintWorkbook(state, config);
    const credentialWorkbook = calculateCredentialWorkbook(state, config);
    const readyWorkbook = calculateReadyProductWorkbook(state, config);
    const businessCardWorkbook = calculateBusinessCardWorkbook(state);
    const flyerWorkbook = calculateFlyerWorkbook(state);
    const m2Workbook = calculateM2WorkbookFromConfig(state, config);
    const resinWorkbook = calculateResinWorkbook(state, config);
    const title = state.client.name.trim() || `Orçamento ${new Date().toLocaleDateString("pt-BR")}`;
    const summary = createQuoteText(state, workbook, colorWorkbook, credentialWorkbook, readyWorkbook, businessCardWorkbook, flyerWorkbook, m2Workbook, resinWorkbook).split("\n").slice(0, 10).join(" • ");
    const subtotal = workbook.totals.totalGeneral + colorWorkbook.totals.totalGeneral + credentialWorkbook.totals.totalGeneral + readyWorkbook.totals.totalGeneral + businessCardWorkbook.totals.totalGeneral + flyerWorkbook.totals.totalGeneral + m2Workbook.totals.totalGeneral + resinWorkbook.totals.totalGeneral;
    const quoteDiscount = calculateDiscount(subtotal, state.quoteDiscountType, state.quoteDiscountValue);

    state.quoteHistory.unshift({
      id: `quote-${Date.now()}`,
      title,
      clientName: state.client.name.trim(),
      total: quoteDiscount.total,
      summary,
      createdAt: new Date().toISOString(),
    });

    state.quoteHistory = state.quoteHistory.slice(0, 20);
    persist();
    renderHistoryTab();
    setMainFeedback("Orçamento salvo no histórico compartilhado.", "success");
  });

  clientsList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-client-action]");
    if (!button) {
      return;
    }

    const client = state.clients.find((item) => item.id === button.dataset.clientId);
    if (!client) {
      return;
    }

    if (button.dataset.clientAction === "load") {
      state.client.name = client.name;
      state.client.contact = client.contact;
      state.client.cnpj = client.cnpj;
      state.quoteNotes = client.notes || state.quoteNotes;
      persistLocalOnly();
      renderAll();
      setMainFeedback("Cliente carregado no orçamento atual.", "success");
    } else if (button.dataset.clientAction === "edit") {
      activeClientEditorId = client.id;
      fillClientRecordForm(client);
      setClientsFeedback(`Contato "${client.name || "Sem nome"}" carregado para edição.`, "success");
    } else if (button.dataset.clientAction === "delete") {
      if (!(await confirmAppAction({
        kicker: "Exclusão",
        title: "Excluir cliente salvo",
        message: `Deseja realmente excluir o cliente "${client.name || "Sem nome"}" da base compartilhada?`,
        confirmLabel: "Excluir",
        danger: true,
      }))) {
        setMainFeedback("A exclusão do cliente foi cancelada.", "warning");
        return;
      }
      state.clients = state.clients.filter((item) => item.id !== client.id);
      if (activeClientEditorId === client.id) {
        resetClientRecordForm();
      }
      persist();
      renderClientsTab();
      setClientsFeedback("Contato excluído da base compartilhada.", "warning");
    }
  });

  historyList.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-history-action]");
    if (!button) {
      return;
    }

    const item = state.quoteHistory.find((entry) => entry.id === button.dataset.quoteId);
    if (!item) {
      return;
    }

    if (button.dataset.historyAction === "load-client") {
      state.client.name = item.clientName || state.client.name;
      persist();
      renderAll();
      setMainFeedback("Cliente do histórico carregado no orçamento atual.", "success");
    } else if (button.dataset.historyAction === "copy") {
      navigator.clipboard.writeText(item.summary || item.title || "").catch(() => {});
      setMainFeedback("Resumo do histórico copiado.", "success");
    } else if (button.dataset.historyAction === "delete") {
      if (!(await confirmAppAction({
        kicker: "Exclusão",
        title: "Excluir item do histórico",
        message: `Deseja realmente excluir o histórico "${item.title || "Orçamento salvo"}"?`,
        confirmLabel: "Excluir",
        danger: true,
      }))) {
        setMainFeedback("A exclusão do histórico foi cancelada.", "warning");
        return;
      }
      state.quoteHistory = state.quoteHistory.filter((entry) => entry.id !== item.id);
      persist();
      renderHistoryTab();
      setMainFeedback("Item removido do histórico.", "warning");
    }
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

  await bootstrapSharedState();
  startSharedRefresh();
  renderAll();
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  initApp().catch(() => {});
}


















































