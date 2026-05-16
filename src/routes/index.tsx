import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../components/PageHeader";
import { useBudget } from "../lib/budget-store";
import {
  daysInCurrentMonth,
  daysRemainingThisMonth,
  formatMoney,
  isInCurrentMonth,
} from "../lib/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home — Our Family Budget" },
      {
        name: "description",
        content:
          "Your family's monthly overview: remaining money, budget health, daily safe spend, and active goal at a glance.",
      },
      { property: "og:title", content: "Home — Our Family Budget" },
      {
        property: "og:description",
        content: "See how your family's budget is doing this month at a glance.",
      },
    ],
  }),
  component: HomePage,
});

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

type Health = { label: string; tone: "safe" | "careful" | "danger"; emoji: string };

function getHealth(percentLeft: number): Health {
  if (percentLeft > 0.4) return { label: "SAFE", tone: "safe", emoji: "🟢" };
  if (percentLeft >= 0.2) return { label: "CAREFUL", tone: "careful", emoji: "🟡" };
  return { label: "DANGER", tone: "danger", emoji: "🔴" };
}

function HomePage() {
  const { income, expenses, goals, hydrated } = useBudget();
  const [greet, setGreet] = useState("Hello");
  useEffect(() => {
    setGreet(greeting());
  }, []);

  const monthlyIncome = income.monthly_income;

  const totalSpent = useMemo(
    () =>
      hydrated
        ? expenses.filter((e) => isInCurrentMonth(e.date)).reduce((s, e) => s + e.amount, 0)
        : 0,
    [expenses, hydrated],
  );

  const remaining = monthlyIncome - totalSpent;
  const remainingDays = hydrated ? daysRemainingThisMonth() : 1;
  const monthDays = hydrated ? daysInCurrentMonth() : 0;
  const dailySafe = remainingDays > 0 ? Math.max(0, remaining) / remainingDays : 0;
  const percentLeft = monthlyIncome > 0 ? remaining / monthlyIncome : 0;
  const health = getHealth(percentLeft);
  const firstGoal = goals[0];
  const goalPct = firstGoal && firstGoal.target_amount > 0
    ? Math.min(100, Math.max(0, (firstGoal.saved_amount / firstGoal.target_amount) * 100))
    : 0;

  const healthBg =
    health.tone === "safe"
      ? "bg-primary/10 text-primary"
      : health.tone === "careful"
        ? "bg-warning/20 text-warning-foreground"
        : "bg-destructive/15 text-destructive";

  return (
    <div className="space-y-4">
      <PageHeader
        title={
          <>
            {greet}, Family <span aria-hidden>👨‍👩‍👧</span>
          </>
        }
        subtitle="Monthly Overview"
      />

      {hydrated && monthlyIncome === 0 ? (
        <div className="rounded-2xl bg-card p-5 text-center shadow-sm">
          <p className="text-base text-foreground">Set your monthly income to begin.</p>
          <Link
            to="/budget"
            className="mt-3 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Add income
          </Link>
        </div>
      ) : null}

      {/* Remaining money */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span aria-hidden>💰</span> Remaining Money
        </div>
        <div className="mt-2 text-3xl font-bold text-foreground">{formatMoney(remaining)}</div>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-secondary p-3">
            <div className="text-muted-foreground">Income</div>
            <div className="mt-1 font-semibold text-foreground">{formatMoney(monthlyIncome)}</div>
          </div>
          <div className="rounded-xl bg-secondary p-3">
            <div className="text-muted-foreground">Spent</div>
            <div className="mt-1 font-semibold text-foreground">{formatMoney(totalSpent)}</div>
          </div>
        </div>
      </section>

      {/* Budget health */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span aria-hidden>🔥</span> Budget Health
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-bold ${healthBg}`}
          >
            <span aria-hidden>{health.emoji}</span> {health.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(Math.max(0, percentLeft) * 100)}% left
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className={`h-full transition-all ${
              health.tone === "safe"
                ? "bg-primary"
                : health.tone === "careful"
                  ? "bg-warning"
                  : "bg-destructive"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, percentLeft * 100))}%` }}
          />
        </div>
      </section>

      {/* Daily safe spending */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span aria-hidden>📅</span> Daily Safe Spending
        </div>
        <p className="mt-2 text-lg font-semibold text-foreground">
          You can safely spend{" "}
          <span className="text-primary">{formatMoney(dailySafe)}</span>/day
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {hydrated ? `${remainingDays} of ${monthDays} days left this month` : "Loading month details"}
        </p>
      </section>

      {/* Active goal */}
      <section className="rounded-2xl bg-card p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <span aria-hidden>🎯</span> Active Goal
        </div>
        {firstGoal ? (
          <div className="mt-2">
            <div className="flex items-baseline justify-between">
              <p className="font-semibold text-foreground">{firstGoal.name}</p>
              <p className="text-sm text-muted-foreground">
                {formatMoney(firstGoal.saved_amount)} / {formatMoney(firstGoal.target_amount)}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-primary" style={{ width: `${goalPct}%` }} />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{Math.round(goalPct)}% saved</p>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-sm text-muted-foreground">Create your first family goal ❤️</p>
            <Link
              to="/goals"
              className="mt-3 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Add goal
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
