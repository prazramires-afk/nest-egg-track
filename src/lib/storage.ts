// LocalStorage-backed types and helpers for Our Family Budget.

export type Income = { monthly_income: number };

export type Category = {
  id: string;
  name: string;
  icon: string;
  monthly_limit: number;
};

export type Expense = {
  id: string;
  amount: number;
  category: string; // category name
  note: string;
  date: string; // ISO date string (YYYY-MM-DD)
};

export type Goal = {
  id: string;
  name: string;
  target_amount: number;
  saved_amount: number;
  monthly_contribution: number;
};

export const STORAGE_KEYS = {
  income: "family_income",
  categories: "family_categories",
  expenses: "family_expenses",
  goals: "family_goals",
} as const;

export const DEFAULT_INCOME: Income = { monthly_income: 0 };

export const DEFAULT_CATEGORIES: Category[] = [
  { id: "cat-rent", name: "Rent/Mortgage", icon: "🏠", monthly_limit: 0 },
  { id: "cat-groceries", name: "Groceries", icon: "🍚", monthly_limit: 0 },
  { id: "cat-transport", name: "Transport", icon: "🚗", monthly_limit: 0 },
  { id: "cat-utilities", name: "Utilities", icon: "💡", monthly_limit: 0 },
  { id: "cat-baby", name: "Baby Needs", icon: "🍼", monthly_limit: 0 },
  { id: "cat-eatingout", name: "Eating Out", icon: "🍽", monthly_limit: 0 },
  { id: "cat-entertainment", name: "Entertainment", icon: "🎬", monthly_limit: 0 },
  { id: "cat-shopping", name: "Shopping", icon: "🛍", monthly_limit: 0 },
  { id: "cat-savings", name: "Savings", icon: "💰", monthly_limit: 0 },
  { id: "cat-emergency", name: "Emergency Fund", icon: "🆘", monthly_limit: 0 },
];

export const DEFAULT_EXPENSES: Expense[] = [];
export const DEFAULT_GOALS: Goal[] = [];

export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readKey<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeKey<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore quota errors */
  }
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatMoney(amount: number): string {
  if (!Number.isFinite(amount)) return "$0";
  const rounded = Math.round(amount * 100) / 100;
  return rounded.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: rounded % 1 === 0 ? 0 : 2,
  });
}

export function todayISO(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function isInCurrentMonth(isoDate: string): boolean {
  const d = new Date(isoDate);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
}

export function daysInCurrentMonth(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export function daysPassedThisMonth(): number {
  return new Date().getDate();
}

export function daysRemainingThisMonth(): number {
  return Math.max(1, daysInCurrentMonth() - daysPassedThisMonth() + 1);
}
