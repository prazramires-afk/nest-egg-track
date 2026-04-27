import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "../components/PageHeader";
import { useBudget } from "../lib/budget-store";
import { formatMoney } from "../lib/storage";

export const Route = createFileRoute("/goals")({
  head: () => ({
    meta: [
      { title: "Goals — Our Family Budget" },
      {
        name: "description",
        content: "Set family savings goals and watch your progress grow each month.",
      },
      { property: "og:title", content: "Goals — Our Family Budget" },
      {
        property: "og:description",
        content: "Save together for the things that matter most.",
      },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { goals, addGoal, deleteGoal, updateGoal } = useBudget();

  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");
  const [contrib, setContrib] = useState("");

  function handleAdd() {
    const trimmed = name.trim();
    const t = Number(target);
    if (!trimmed || !t || t <= 0) return;
    addGoal({
      name: trimmed,
      target_amount: t,
      saved_amount: Number(saved) || 0,
      monthly_contribution: Number(contrib) || 0,
    });
    setName("");
    setTarget("");
    setSaved("");
    setContrib("");
  }

  return (
    <div className="space-y-4">
      <PageHeader title="Family Goals" subtitle="Save together, dream together ❤️" />

      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold text-foreground">Add a goal</h2>
        <div className="mt-3 space-y-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Goal name (e.g. Family vacation)"
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Target</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Saved so far</span>
              <input
                type="number"
                min={0}
                inputMode="decimal"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                placeholder="0"
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
          </div>
          <label className="block">
            <span className="text-xs font-medium text-muted-foreground">Monthly contribution</span>
            <input
              type="number"
              min={0}
              inputMode="decimal"
              value={contrib}
              onChange={(e) => setContrib(e.target.value)}
              placeholder="0"
              className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            onClick={handleAdd}
            className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Save goal
          </button>
        </div>
      </section>

      {goals.length === 0 ? (
        <section className="rounded-2xl bg-card p-5 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Create your first family goal ❤️</p>
        </section>
      ) : (
        <section className="space-y-3">
          {goals.map((g) => {
            const pct =
              g.target_amount > 0
                ? Math.min(100, Math.max(0, (g.saved_amount / g.target_amount) * 100))
                : 0;
            return (
              <div key={g.id} className="rounded-2xl bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{g.name}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {formatMoney(g.saved_amount)} / {formatMoney(g.target_amount)}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteGoal(g.id)}
                    aria-label="Delete goal"
                    className="rounded-xl p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{Math.round(pct)}% saved</span>
                  <span>{formatMoney(g.monthly_contribution)}/mo planned</span>
                </div>

                <AddToSaved
                  onAdd={(v) => updateGoal(g.id, { saved_amount: g.saved_amount + v })}
                />

              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}

function AddToSaved({ onAdd }: { onAdd: (amount: number) => void }) {
  const [value, setValue] = useState("");

  function submit() {
    const v = Number(value);
    if (!v || v <= 0) return;
    onAdd(v);
    setValue("");
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="text-xs text-muted-foreground">Add to saved:</span>
      <input
        type="number"
        min={0}
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        className="w-24 rounded-lg border border-input bg-background px-2 py-1 text-sm outline-none focus:border-primary"
      />
      <button
        onClick={submit}
        className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        Add
      </button>
    </div>
  );
}
