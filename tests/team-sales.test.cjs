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

test("visão do colaborador mostra somente suas vendas sem controle de exclusão", () => {
  const markup = app.createTeamSalesDashboardMarkup({
    mode: "member", month: "2026-11", member: { id: "ana", name: "Ana" },
    selected: { systemTotal: 100, counterTotal: 25, total: 125, count: 2 },
    months: [{ month: "2026-11", systemTotal: 100, counterTotal: 25, total: 125, count: 2 }],
    entries: [{ id: "sale-1", date: "2026-11-05", source: "Balcão", description: "Cópias", clientName: "Cliente A", amount: 25, memberName: "Ana", orderNumber: "" }],
  });
  assert.match(markup, /R\$\s*125,00/);
  assert.doesNotMatch(markup, /data-counter-sale-delete/);
  assert.match(markup, /data-sales-month="2026-11"/);
  assert.doesNotMatch(markup, /Equipe no mês|Sem colaborador/);
});

test("visão geral apresenta vendas sem colaborador e pode corrigir lançamentos de balcão", () => {
  const markup = app.createTeamSalesDashboardMarkup({
    mode: "admin", month: "2026-11", selected: { systemTotal: 50, counterTotal: 0, total: 50, count: 1 },
    months: [],
    team: [{ id: "", name: "Sem colaborador", systemTotal: 50, counterTotal: 0, total: 50, count: 1 }],
    entries: [
      { id: "quote-1", date: "2026-11-04", source: "GrafiCalc", description: "Lona", clientName: "Cliente", amount: 50, memberName: "Sem colaborador", orderNumber: "" },
      { id: "sale-1", date: "2026-11-04", source: "Balcão", description: "Cópias", clientName: "", amount: 10, memberName: "Ana", orderNumber: "" },
    ],
  });
  assert.match(markup, /Equipe no mês/);
  assert.match(markup, /Sem colaborador/);
  assert.match(markup, /data-counter-sale-delete="sale-1"/);
  assert.doesNotMatch(markup, /data-counter-sale-delete="quote-1"/);
});
