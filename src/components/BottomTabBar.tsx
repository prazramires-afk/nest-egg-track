import { Link } from "@tanstack/react-router";
import { Home, Wallet, Receipt, Heart, TrendingUp } from "lucide-react";

const tabs = [
  { to: "/", label: "Home", Icon: Home },
  { to: "/budget", label: "Budget", Icon: Wallet },
  { to: "/expenses", label: "Expenses", Icon: Receipt },
  { to: "/goals", label: "Goals", Icon: Heart },
  { to: "/insights", label: "Insights", Icon: TrendingUp },
] as const;

export function BottomTabBar() {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-1/2 z-50 w-full max-w-md -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
    >
      <ul className="flex items-stretch justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {tabs.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <Link
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="group flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" aria-hidden />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
