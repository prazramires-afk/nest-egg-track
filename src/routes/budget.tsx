import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Plus, Check } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useBudget } from "../lib/budget-store";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget — Our Family Budget" },
      {
        name: "description",
        content: "Set your family's monthly income and category limits to plan ahead with confidence.",
      },
      { property: "og:title", content: "Budget — Our Family Budget" },
      {
        property: "og:description",
        content: "Plan your family's monthly income and category budgets.",
      },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const {
    income,
    setMonthlyIncome,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useBudget();

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newIcon, setNewIcon] = useState("✨");
  const [newLimit, setNewLimit] = useState("");

  function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    addCategory({
      name,
      icon: newIcon.trim() || "✨",
      monthly_limit: Number(newLimit) || 0,
    });
    setNewName("");
    setNewIcon("✨");
    setNewLimit("");
    setShowAdd(false);
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Monthly Budget" subtitle="Plan your family's spending limits" />

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <label htmlFor="income" className="text-sm font-medium text-muted-foreground">
          Monthly Family Income
        </label>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold text-foreground">$</span>
          <input
            id="income"
            inputMode="decimal"
            type="number"
            min={0}
            step="0.01"
            value={income.monthly_income || ""}
            placeholder="0"
            onChange={(e) => setMonthlyIncome(Number(e.target.value))}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-2xl font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Auto-saves as you type.</p>
      </section>

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Category budgets</h2>
          <button
            onClick={() => setShowAdd((v) => !v)}
            className="inline-flex items-center gap-1 rounded-2xl bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add
          </button>
        </div>

        {showAdd ? (
          <div className="mt-3 rounded-xl bg-secondary p-3">
            <div className="grid grid-cols-[3rem_1fr] gap-2">
              <input
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                aria-label="Icon"
                className="rounded-xl border border-input bg-background px-2 py-2 text-center text-lg outline-none focus:border-primary"
                maxLength={2}
              />
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Category name"
                aria-label="Category name"
                className="rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">$</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Monthly limit"
                aria-label="Monthly limit"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={handleAdd}
                className="rounded-2xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
              >
                Save
              </button>
            </div>
          </div>
        ) : null}

        <ul className="mt-3 space-y-2">
          {categories.map((c) => (
            <li
              key={c.id}
              className="flex items-center gap-3 rounded-xl bg-secondary p-3"
            >
              <span className="text-xl" aria-hidden>{c.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-semibold text-foreground">{c.name}</div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <span>$</span>
                  <input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={c.monthly_limit || ""}
                    placeholder="0"
                    onChange={(e) =>
                      updateCategory(c.id, { monthly_limit: Number(e.target.value) || 0 })
                    }
                    className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-sm text-foreground outline-none focus:border-primary"
                  />
                  <span>/ month</span>
                </div>
              </div>
              <button
                onClick={() => deleteCategory(c.id)}
                aria-label={`Delete ${c.name}`}
                className="rounded-xl p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
