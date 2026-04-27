import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader } from "../components/PageHeader";
import { useBudget } from "../lib/budget-store";
import {
  daysInCurrentMonth,
  daysPassedThisMonth,
  formatMoney,
  isInCurrentMonth,
} from "../lib/storage";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Our Family Budget" },
      {
        name: "description",
        content: "Friendly, automatic insights about your family's spending and saving habits.",
      },
      { property: "og:title", content: "Insights — Our Family Budget" },
      {
        property: "og:description",
        content: "Smart, gentle nudges to keep your family budget on track.",
      },
    ],
  }),
  component: InsightsPage,
});

type Insight = {
  id: string;
  tone: "warning" | "danger" | "praise" | "info";
  emoji: string;
  title: string;
  body: string;
};

function InsightsPage() {
  const { categories, expenses, income } = useBudget();

  const insights = useMemo<Insight[]>(() => {
    const list: Insight[] = [];
    const monthExpenses = expenses.filter((e) => isInCurrentMonth(e.date));
    const daysPassed = Math.max(1, daysPassedThisMonth());
    const totalDays = daysInCurrentMonth();

    // Per-category spend this month
    const byCat = new Map<string, number>();
    for (const e of monthExpenses) {
      byCat.set(e.category, (byCat.get(e.category) ?? 0) + e.amount);
    }

    // 1. Overspending prediction per category with a limit
    for (const cat of categories) {
      const spent = byCat.get(cat.name) ?? 0;
      if (cat.monthly_limit <= 0 || spent <= 0) continue;
      const dailyRate = spent / daysPassed;
      const projected = dailyRate * totalDays;
      if (projected > cat.monthly_limit) {
        list.push({
          id: `over-${cat.id}`,
          tone: "warning",
          emoji: "⚠️",
          title: `You may exceed ${cat.name} budget this month`,
          body: `Projected: ${formatMoney(projected)} of ${formatMoney(cat.monthly_limit)} limit. Try slowing down a bit.`,
        });
      }
    }

    // 2. Eating out > 30% of groceries
    const eatingOut = byCat.get("Eating Out") ?? 0;
    const groceries = byCat.get("Groceries") ?? 0;
    if (groceries > 0 && eatingOut > groceries * 0.3) {
      list.push({
        id: "eating-out",
        tone: "warning",
        emoji: "🍽",
        title: "You are spending a lot on restaurants this month",
        body: `Eating out is ${formatMoney(eatingOut)} compared to ${formatMoney(groceries)} on groceries. Cooking together at home could help.`,
      });
    }

    // 3. Savings praise > 10% of income
    const savings = byCat.get("Savings") ?? 0;
    if (income.monthly_income > 0 && savings > income.monthly_income * 0.1) {
      list.push({
        id: "savings-praise",
        tone: "praise",
        emoji: "❤️",
        title: "Great job saving this month",
        body: `You've put aside ${formatMoney(savings)} so far — over 10% of your income. Keep it up!`,
      });
    }

    return list;
  }, [categories, expenses, income.monthly_income]);

  return (
    <div className="space-y-4">
      <PageHeader title="Insights" subtitle="Gentle nudges to help your family thrive" />

      {insights.length === 0 ? (
        <section className="rounded-2xl bg-card p-6 text-center shadow-sm">
          <div className="text-4xl" aria-hidden>🌱</div>
          <p className="mt-2 text-base font-semibold text-foreground">All looking good</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Keep tracking your family's spending and goals — we'll let you know when something
            stands out.
          </p>
        </section>
      ) : (
        <section className="space-y-3">
          {insights.map((it) => {
            const styles =
              it.tone === "praise"
                ? "bg-primary/10 border-primary/30"
                : it.tone === "danger"
                  ? "bg-destructive/10 border-destructive/30"
                  : it.tone === "warning"
                    ? "bg-warning/15 border-warning/40"
                    : "bg-card border-border";
            return (
              <div key={it.id} className={`rounded-2xl border p-5 shadow-sm ${styles}`}>
                <div className="flex items-start gap-3">
                  <div className="text-2xl" aria-hidden>{it.emoji}</div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{it.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{it.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}
    </div>
  );
}
