const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = { window: { BLOCK_CATALOG: [] }, document: { getElementById: () => ({ innerHTML: "" }) }, Intl, URL, console };
vm.createContext(app);
vm.runInContext(source, app);

const date = new Date("2026-10-29T12:00:00.000Z");
const client = { id: "client-1", name: "Cliente Exemplo", contact: "48 99999-0000", cnpj: "12.345.678/0001-90" };
const approvedQuote = {
  id: "quote-1", title: "Pedido de adesivos", clientId: client.id, clientName: client.name,
  status: "Aprovado", total: 145, items: [{ description: "Adesivo", detail: "10 unidades", extraDetail: "Laminação", total: 145 }],
  snapshot: { client, productionDeadline: "3 dias úteis" },
};

test("somente orçamento aprovado com cliente e funcionário gera O.S. completa", () => {
  const pending = { ...approvedQuote, status: "Pendente" };
  assert.equal(app.createServiceOrderFromQuote(pending, [client], [], "Ana", date, () => 0.1), null);
  assert.equal(app.createServiceOrderFromQuote(approvedQuote, [client], [], "", date, () => 0.1), null);
  assert.equal(app.createServiceOrderFromQuote({ ...approvedQuote, clientName: "", clientId: "", snapshot: null }, [], [], "Ana", date, () => 0.1), null);

  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], " Ana ", date, () => 0.1);
  assert.equal(order.number, "OS-20261029-10000000");
  assert.equal(order.status, "Em produção");
  assert.equal(order.employeeName, "Ana");
  assert.equal(order.clientContact, client.contact);
  assert.equal(order.clientCnpj, client.cnpj);
  assert.equal(order.productionDeadline, "3 dias úteis");
  assert.equal(order.items[0].description, "Adesivo");
  assert.equal(order.total, 145);
  assert.equal(app.createServiceOrderFromQuote(approvedQuote, [client], [order], "Bia", date, () => 0.2), null);
});

test("numeração evita colisão local e etapas registram pronto e retirado", () => {
  const first = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  const second = app.createServiceOrderFromQuote({ ...approvedQuote, id: "quote-2" }, [client], [first], "Bia", date, () => 0.1);
  assert.notEqual(first.number, second.number);
  assert.equal(app.updateServiceOrderStatus(first, "Pronto pra entrega", new Date("2026-10-30T12:00:00Z")), true);
  assert.equal(first.readyAt, "2026-10-30T12:00:00.000Z");
  assert.equal(app.updateServiceOrderStatus(first, "Retirado", new Date("2026-10-31T12:00:00Z")), true);
  assert.equal(first.collectedAt, "2026-10-31T12:00:00.000Z");
  assert.equal(app.updateServiceOrderStatus(first, "Em produção", new Date("2026-11-01T12:00:00Z")), true);
  assert.equal(first.readyAt, "");
  assert.equal(first.collectedAt, "");
});

test("O.S. permanece no estado compartilhável e mostra cliente e funcionário", () => {
  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  const state = app.mergeState({ serviceOrders: [order] });
  assert.equal(state.serviceOrders.length, 1);
  assert.equal(state.serviceOrders[0].number, order.number);
  assert.equal(state.serviceOrders[0].employeeName, "Ana");
  assert.equal(state.serviceOrders[0].items[0].detail, "10 unidades");
  const markup = app.createServiceOrderMarkup(order);
  assert.match(markup, /O\.S\. nº OS-20261029-10000000/);
  assert.match(markup, /Cliente Exemplo/);
  assert.match(markup, /Ana/);
  assert.match(markup, /Adesivo/);
});

test("orçamento aprovado libera geração uma vez e depois mostra a O.S. vinculada", () => {
  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  const before = app.createQuoteRecordMarkup(approvedQuote, [client]);
  assert.match(before, /Gerar O\.S\./);
  assert.match(before, /Funcionário responsável/);
  const after = app.createQuoteRecordMarkup(approvedQuote, [client], { serviceOrders: [order] });
  assert.doesNotMatch(after, /Gerar O\.S\./);
  assert.match(after, /Abrir O\.S\./);
  assert.match(after, /data-quote-status="quote-1" disabled/);
  assert.match(after, /OS-20261029-10000000/);
});

test("comanda mantém aviso, dados e agrupa três O.S. por página A4", () => {
  const orders = Array.from({ length: 4 }, (_, index) => ({
    ...app.createServiceOrderFromQuote({ ...approvedQuote, id: `quote-${index}` }, [client], [], "Ana", date, () => index / 10),
    number: `OS-20261029-${index + 1}`,
  }));
  const markup = app.createServiceOrderPrintMarkup(orders, { name: "Copy Boy" });
  assert.equal((markup.match(/class="os-print-page"/g) || []).length, 2);
  assert.equal((markup.match(/class="os-slip"/g) || []).length, 4);
  const firstPage = markup.split('</div><div class="os-print-page">')[0];
  assert.equal((firstPage.match(/class="os-slip"/g) || []).length, 3);
  assert.match(markup, /Ordem de Serviço/);
  assert.match(markup, /Cliente Exemplo/);
  assert.match(markup, /Funcionário:<\/b> Ana/);
  assert.match(markup, /Adesivo/);
  assert.match(markup, /Confirmo ter conferido todo o pedido retirado na presente data/);
  assert.match(markup, /abdico o direito de reclamações/);
  assert.match(markup, /Nome: <i><\/i>/);
  assert.match(markup, /Ass: <i><\/i>/);
  assert.match(markup, /Data: <i><\/i>/);
  const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  assert.match(css, /size: A4 portrait/);
  assert.match(css, /width: 20cm/);
  assert.match(css, /height: 9\.5cm/);
  const selectedCard = app.createServiceOrderMarkup(orders[0], { selectedForPrint: true });
  assert.match(selectedCard, /data-os-select="service-order-quote-0"[^>]* checked/);
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  assert.match(html, /id="os-print-selected"/);
  assert.match(html, /id="os-select-visible"/);
});

test("pedido com muitos materiais continua em outra comanda sem perder itens", () => {
  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  order.items = Array.from({ length: 30 }, (_, index) => ({ description: `Material ${index + 1}`, detail: `Detalhe ${index + 1}`, extraDetail: "" }));
  const markup = app.createServiceOrderPrintMarkup([order], { name: "Copy Boy" });
  assert.ok((markup.match(/class="os-slip"/g) || []).length > 1);
  assert.match(markup, /Continuação 2 de/);
  for (let index = 1; index <= 30; index += 1) assert.match(markup, new RegExp(`Material ${index}(?!\\d)`));
});

test("três materiais detalhados cabem em uma comanda sem linhas de preenchimento", () => {
  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  order.items = ["Rótulo Bamboo", "Verso sabonete líquido", "Fragrância 81"].map((name, index) => ({
    description: `${name} - Adesivo vinil com impressão digital`,
    detail: `${[70, 200, 300][index]} unidades | 4 x 9 cm | Adesivo impressão digital com corte especial`,
    extraDetail: "Mídia: Adesivo transparente brilho",
  }));
  const markup = app.createServiceOrderPrintMarkup([order], { name: "Copy Boy" });
  assert.equal((markup.match(/class="os-slip"/g) || []).length, 1);
  assert.doesNotMatch(markup, /os-slip-writing-lines/);
  assert.match(markup, /Fragrância 81/);
});

test("materiais detalhados ocupam duas colunas antes de criar continuação", () => {
  const order = app.createServiceOrderFromQuote(approvedQuote, [client], [], "Ana", date, () => 0.1);
  order.items = Array.from({ length: 5 }, (_, index) => ({
    description: `Rótulo ${index + 1} - Adesivo vinil com impressão digital`,
    detail: "200 unidades | 4 x 9 cm | Adesivo impressão digital com corte especial",
    extraDetail: "Mídia: Adesivo transparente brilho",
  }));
  const markup = app.createServiceOrderPrintMarkup([order], { name: "Copy Boy" });
  assert.equal((markup.match(/class="os-slip"/g) || []).length, 1);
  assert.match(markup, /data-columns="2"/);
  assert.match(markup, /Rótulo 5/);
});
