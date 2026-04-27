import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_EXPENSES,
  DEFAULT_GOALS,
  DEFAULT_INCOME,
  STORAGE_KEYS,
  newId,
  readKey,
  writeKey,
  type Category,
  type Expense,
  type Goal,
  type Income,
} from "./storage";

type BudgetContextValue = {
  hydrated: boolean;
  income: Income;
  categories: Category[];
  expenses: Expense[];
  goals: Goal[];

  setMonthlyIncome: (amount: number) => void;

  addCategory: (input: Omit<Category, "id">) => void;
  updateCategory: (id: string, patch: Partial<Omit<Category, "id">>) => void;
  deleteCategory: (id: string) => void;

  addExpense: (input: Omit<Expense, "id">) => void;
  updateExpense: (id: string, patch: Partial<Omit<Expense, "id">>) => void;
  deleteExpense: (id: string) => void;

  addGoal: (input: Omit<Goal, "id">) => void;
  updateGoal: (id: string, patch: Partial<Omit<Goal, "id">>) => void;
  deleteGoal: (id: string) => void;
};

const BudgetContext = createContext<BudgetContextValue | null>(null);

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [income, setIncome] = useState<Income>(DEFAULT_INCOME);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [expenses, setExpenses] = useState<Expense[]>(DEFAULT_EXPENSES);
  const [goals, setGoals] = useState<Goal[]>(DEFAULT_GOALS);

  // Hydrate from LocalStorage on mount.
  useEffect(() => {
    setIncome(readKey<Income>(STORAGE_KEYS.income, DEFAULT_INCOME));
    setCategories(readKey<Category[]>(STORAGE_KEYS.categories, DEFAULT_CATEGORIES));
    setExpenses(readKey<Expense[]>(STORAGE_KEYS.expenses, DEFAULT_EXPENSES));
    setGoals(readKey<Goal[]>(STORAGE_KEYS.goals, DEFAULT_GOALS));
    setHydrated(true);
  }, []);

  // Persist on change (after hydration only).
  useEffect(() => {
    if (hydrated) writeKey(STORAGE_KEYS.income, income);
  }, [hydrated, income]);
  useEffect(() => {
    if (hydrated) writeKey(STORAGE_KEYS.categories, categories);
  }, [hydrated, categories]);
  useEffect(() => {
    if (hydrated) writeKey(STORAGE_KEYS.expenses, expenses);
  }, [hydrated, expenses]);
  useEffect(() => {
    if (hydrated) writeKey(STORAGE_KEYS.goals, goals);
  }, [hydrated, goals]);

  const setMonthlyIncome = useCallback((amount: number) => {
    setIncome({ monthly_income: Number.isFinite(amount) ? Math.max(0, amount) : 0 });
  }, []);

  const addCategory = useCallback((input: Omit<Category, "id">) => {
    setCategories((prev) => [...prev, { ...input, id: newId() }]);
  }, []);
  const updateCategory = useCallback(
    (id: string, patch: Partial<Omit<Category, "id">>) => {
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    },
    [],
  );
  const deleteCategory = useCallback((id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const addExpense = useCallback((input: Omit<Expense, "id">) => {
    setExpenses((prev) => [{ ...input, id: newId() }, ...prev]);
  }, []);
  const updateExpense = useCallback(
    (id: string, patch: Partial<Omit<Expense, "id">>) => {
      setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e)));
    },
    [],
  );
  const deleteExpense = useCallback((id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const addGoal = useCallback((input: Omit<Goal, "id">) => {
    setGoals((prev) => [...prev, { ...input, id: newId() }]);
  }, []);
  const updateGoal = useCallback((id: string, patch: Partial<Omit<Goal, "id">>) => {
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }, []);
  const deleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const value = useMemo<BudgetContextValue>(
    () => ({
      hydrated,
      income,
      categories,
      expenses,
      goals,
      setMonthlyIncome,
      addCategory,
      updateCategory,
      deleteCategory,
      addExpense,
      updateExpense,
      deleteExpense,
      addGoal,
      updateGoal,
      deleteGoal,
    }),
    [
      hydrated,
      income,
      categories,
      expenses,
      goals,
      setMonthlyIncome,
      addCategory,
      updateCategory,
      deleteCategory,
      addExpense,
      updateExpense,
      deleteExpense,
      addGoal,
      updateGoal,
      deleteGoal,
    ],
  );

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export function useBudget(): BudgetContextValue {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used inside <BudgetProvider>");
  return ctx;
}
