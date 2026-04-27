# Our Family Budget — Build Plan

A warm, friendly, offline-first mobile web app for couples and young families to track expenses, plan budgets, save toward goals, and get gentle insights — all stored locally in the browser, no login, no backend.

## Design system

- Warm, family-oriented tone (not corporate finance)
- Colors: primary `#5DB075` (soft green), secondary `#F6F2E9` (warm beige), danger `#FF6B6B`, warning `#FFC857`, text `#2F2F2F`, white cards
- Rounded corners 16px everywhere, soft shadows
- Bold friendly headings, simple readable body
- Mobile-first layout with a max-width container so it also looks good on desktop
- Bottom tab bar (5 tabs) fixed to viewport bottom

## App shell & navigation

- Single TanStack Start app with one route per tab:
  - `/` — Home dashboard
  - `/budget` — Monthly Budget
  - `/expenses` — Expense Tracker
  - `/goals` — Family Goals
  - `/insights` — Insights
- Shared layout in `__root.tsx` renders the page outlet plus a sticky bottom tab bar with icons + labels (Home, Budget, Expenses, Goals, Insights). Active tab uses primary green.
- Each route has its own `head()` metadata (title + description) for clean tab titles and shareability.

## Local data layer

A small typed storage module wraps `localStorage` with these keys and defaults, hydrating safely on first load:

- `family_income` → `{ monthly_income: number }` (default `0`)
- `family_categories` → array of `{ id, name, icon, monthly_limit }`. Seeded on first run with: Rent/Mortgage 🏠, Groceries 🍚, Transport 🚗, Utilities 💡, Baby Needs 🍼, Eating Out 🍽, Entertainment 🎬, Shopping 🛍, Savings 💰, Emergency Fund 🆘 (each with `monthly_limit: 0`)
- `family_expenses` → array of `{ id, amount, category, note, date }`
- `family_goals` → array of `{ id, name, target_amount, saved_amount, monthly_contribution }`

A React context + hooks (`useIncome`, `useCategories`, `useExpenses`, `useGoals`) expose state and auto-persist on every change. SSR-safe (reads guarded behind `typeof window`).

## Page 1 — Home dashboard (`/`)

- Friendly time-aware greeting: "Good morning/afternoon/evening, Family 👨‍👩‍👧" + "Monthly Overview" subtitle
- Computed values:
  - `totalSpent` = sum of expenses in current month
  - `remaining` = income − totalSpent
  - `remainingDays` = days left in current month
  - `dailySafeSpend` = remaining / remainingDays
  - `percentLeft` = remaining / income
- Cards:
  - **💰 Remaining Money** — Income, Spent, Remaining
  - **🔥 Budget Health** — badge SAFE 🟢 (>40%) / CAREFUL 🟡 (20–40%) / DANGER 🔴 (<20%) with matching color
  - **📅 Daily Safe Spending** — "You can safely spend $X/day"
  - **🎯 Active Goal Preview** — first goal with progress bar and % text
- Empty state when income = 0: gentle CTA "Set your monthly income to begin." linking to Budget tab

## Page 2 — Monthly Budget (`/budget`)

- **Income section** — single number input "Monthly Family Income", auto-saves on blur/change
- **Category list** — each row shows icon, name, monthly limit input (editable inline), and a delete button
- **Add category** — button opens a small form (name, emoji icon, monthly limit) and appends to list
- All edits persist immediately to LocalStorage

## Page 3 — Expense Tracker (`/expenses`)

- **Add Expense card** at top: amount, category dropdown (from categories), optional note, date (defaults to today), Save button
- **Quick Add buttons** — Groceries, Transport, Eating Out — open a small popup asking only for amount, then create the expense for today
- **Expense list** — newest first, each row: amount (bold), category with icon, note, formatted date, delete button
- Empty state: "Start tracking your first expense 💸"

## Page 4 — Family Goals (`/goals`)

- **Add Goal form**: name, target amount, saved amount, monthly contribution
- **Goal cards**: name, "saved / target", progress bar (`saved/target`), percentage text, edit/delete actions
- Empty state: "Create your first family goal ❤️"

## Page 5 — Insights (`/insights`)

Auto-generated smart insights based on current month data:

1. **Overspending prediction** — for each category with spend, compute `dailyRate = spent / daysPassed`, `projected = dailyRate * daysInMonth`; if `projected > monthly_limit`, show warning card: "You may exceed {category} budget this month."
2. **Eating Out warning** — if Eating Out spend > 30% of Groceries spend: "You are spending a lot on restaurants this month."
3. **Savings praise** — if Savings spend > 10% of income: "Great job saving this month ❤️"

If no insights apply, show a friendly "All looking good — keep it up! 🌱" state.

## Behavior

- Everything auto-saves to LocalStorage on change
- No loading screens, no auth, fully offline after first load
- All currency rendered with a simple `$` formatter (locale-aware)
- All IDs generated with `crypto.randomUUID()`

## Technical notes

- TanStack Start file-based routes under `src/routes/`: `index.tsx`, `budget.tsx`, `expenses.tsx`, `goals.tsx`, `insights.tsx`
- Bottom tab nav lives in `__root.tsx` so it persists across routes
- Tailwind v4 theme tokens in `src/styles.css` extended with the brand palette (primary/secondary/danger/warning) so utilities like `bg-primary`, `text-danger` work
- shadcn primitives reused: `button`, `input`, `card`, `select`, `dialog` (for quick-add popup), `progress`, `badge`
- LocalStorage access guarded for SSR; initial render uses defaults, then hydrates client-side via `useEffect`
- No external network calls, no backend, no Lovable Cloud needed
