import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useBudget } from "../lib/budget-store";
import { formatMoney, todayISO, type Expense } from "../lib/storage";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expenses — Our Family Budget" },
      {
        name: "description",
        content: "Add expenses quickly and see your family's spending history at a glance.",
      },
      { property: "og:title", content: "Expenses — Our Family Budget" },
      {
        property: "og:description",
        content: "Track every family expense in seconds.",
      },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { categories, expenses, addExpense, updateExpense, deleteExpense } = useBudget();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]?.name ?? "");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());

  // Quick add popup state
  const [quickFor, setQuickFor] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState("");

  // Edit modal state
  const [editing, setEditing] = useState<Expense | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editNote, setEditNote] = useState("");
  const [editDate, setEditDate] = useState("");

  useEffect(() => {
    if (editing) {
      setEditAmount(String(editing.amount));
      setEditCategory(editing.category);
      setEditNote(editing.note);
      setEditDate(editing.date);
    }
  }, [editing]);

  function handleEditSave() {
    if (!editing) return;
    const amt = Number(editAmount);
    if (!amt || amt <= 0) return;
    updateExpense(editing.id, {
      amount: amt,
      category: editCategory || categories[0]?.name || "Other",
      note: editNote.trim(),
      date: editDate || todayISO(),
    });
    setEditing(null);
  }

  function handleSave() {
    const amt = Number(amount);
    if (!amt || amt <= 0) return;
    addExpense({
      amount: amt,
      category: category || categories[0]?.name || "Other",
      note: note.trim(),
      date: date || todayISO(),
    });
    setAmount("");
    setNote("");
    setDate(todayISO());
  }

  function handleQuickSave() {
    const amt = Number(quickAmount);
    if (!amt || amt <= 0 || !quickFor) return;
    addExpense({ amount: amt, category: quickFor, note: "", date: todayISO() });
    setQuickAmount("");
    setQuickFor(null);
  }

  const quickCats = ["Groceries", "Transport", "Eating Out"];

  return (
    <div className="space-y-4">
      <PageHeader title="Expenses" subtitle="Add and review your family spending" />

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Add expense</h2>

        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Amount</label>
            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">$</span>
              <input
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xl font-bold text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Note (optional)</label>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Weekly grocery run"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Save expense
          </button>
        </div>
      </section>

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">Quick add</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {quickCats.map((name) => (
            <button
              key={name}
              onClick={() => {
                setQuickFor(name);
                setQuickAmount("");
              }}
              className="rounded-2xl bg-accent px-2 py-3 text-xs font-semibold text-accent-foreground transition hover:bg-accent/80"
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {quickFor ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
          onClick={() => setQuickFor(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground">Add to {quickFor}</h3>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">$</span>
              <input
                autoFocus
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                placeholder="0"
                className="w-full rounded-xl border border-input bg-background px-3 py-2 text-2xl font-bold outline-none focus:border-primary"
              />
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setQuickFor(null)}
                className="flex-1 rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickSave}
                className="flex-1 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Recent expenses</h2>
        {expenses.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Start tracking your first expense 💸
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {expenses.map((e) => {
              const cat = categories.find((c) => c.name === e.category);
              return (
                <li
                  key={e.id}
                  className="flex items-center gap-3 rounded-xl bg-secondary p-3"
                >
                  <span className="text-xl" aria-hidden>{cat?.icon ?? "💵"}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-semibold text-foreground">
                        {e.category}
                      </span>
                      <span className="font-bold text-foreground">{formatMoney(e.amount)}</span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{e.note || "—"}</span>
                      <span>{new Date(e.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={() => setEditing(e)}
                      aria-label="Edit expense"
                      className="rounded-xl p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteExpense(e.id)}
                      aria-label="Delete expense"
                      className="rounded-xl p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {editing ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-4 sm:items-center"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-lg"
            onClick={(ev) => ev.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground">Edit expense</h3>

            <div className="mt-3 space-y-3">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Amount</label>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xl font-bold text-foreground">$</span>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    inputMode="decimal"
                    value={editAmount}
                    onChange={(ev) => setEditAmount(ev.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xl font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Category</label>
                <select
                  value={editCategory}
                  onChange={(ev) => setEditCategory(ev.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.icon} {c.name}
                    </option>
                  ))}
                  {/* Preserve original category if it no longer exists */}
                  {editing && !categories.some((c) => c.name === editing.category) ? (
                    <option value={editing.category}>{editing.category}</option>
                  ) : null}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Note</label>
                <input
                  value={editNote}
                  onChange={(ev) => setEditNote(ev.target.value)}
                  placeholder="Optional note"
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground">Date</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(ev) => setEditDate(ev.target.value)}
                  className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 rounded-2xl bg-secondary px-4 py-2 text-sm font-semibold text-secondary-foreground"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="flex-1 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
