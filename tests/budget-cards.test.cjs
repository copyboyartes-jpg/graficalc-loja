const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.mjs"), "utf8")
  .split('if (typeof window !== "undefined" && typeof document !== "undefined")')[0];
const app = { window: { BLOCK_CATALOG: [] }, Intl, URL, console };
vm.createContext(app);
vm.runInContext(source, app);

function control(existingLabel = "") {
  const attributes = existingLabel ? { "aria-label": existingLabel } : {};
  return {
    hasAttribute: (name) => Object.hasOwn(attributes, name),
    closest: () => null,
    setAttribute: (name, value) => { attributes[name] = value; },
    get label() { return attributes["aria-label"]; },
  };
}

function cell(fields = []) {
  const classes = new Set();
  return {
    dataset: {},
    classList: { add: (name) => classes.add(name), contains: (name) => classes.has(name) },
    querySelectorAll: () => fields,
  };
}

test("todas as tabelas de orçamento usam cartões, sem alterar tabelas de configuração", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const budgetTables = (html.match(/<table class="budget-table/g) || []).length;
  const cardShells = (html.match(/class="table-shell budget-card-shell"/g) || []).length;
  assert.equal(budgetTables, 11);
  assert.equal(cardShells, budgetTables);
  assert.match(html, /class="free-quote-items"/);
});

test("cada campo recebe o rótulo correto e um nome acessível por item", () => {
  const description = control();
  const existing = control("Rótulo personalizado");
  const firstRow = { children: [cell(), cell([description]), cell([existing])] };
  const secondQuantity = control();
  const secondRow = { children: [cell(), cell(), cell([secondQuantity])] };
  const headers = ["Item", "Descrição", "Total item"].map((textContent) => ({ textContent }));
  const table = {
    querySelectorAll: (selector) => selector === "thead th" ? headers : [firstRow, secondRow],
  };
  app.labelBudgetCardFields({ querySelectorAll: () => [table] });

  assert.equal(firstRow.children[0].dataset.cardLabel, "Item");
  assert.ok(firstRow.children[0].classList.contains("budget-card-item"));
  assert.equal(firstRow.children[1].dataset.cardLabel, "Descrição");
  assert.ok(firstRow.children[1].classList.contains("budget-card-description"));
  assert.equal(description.label, "Descrição do item 1");
  assert.ok(firstRow.children[2].classList.contains("budget-card-total"));
  assert.equal(existing.label, "Rótulo personalizado");
  assert.equal(secondQuantity.label, "Total item do item 2");
});

test("layout remove largura mínima e rotação das tabelas de orçamento", () => {
  const css = fs.readFileSync(path.join(__dirname, "..", "styles.css"), "utf8");
  assert.match(css, /\.budget-card-shell \.budget-table\s*\{[^}]*min-width: 0;[^}]*transform: none;/s);
  assert.match(css, /\.budget-card-shell \.budget-table tbody tr\s*\{[^}]*display: grid;[^}]*grid-template-columns: repeat\(auto-fit,/s);
  assert.match(css, /content: attr\(data-card-label\)/);
});
