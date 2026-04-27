import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { BudgetProvider } from "../lib/budget-store";
import { BottomTabBar } from "../components/BottomTabBar";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#5DB075" },
      { title: "Our Family Budget — Friendly offline budgeting" },
      {
        name: "description",
        content:
          "A warm, offline-first budgeting app for couples and young families. Track expenses, plan budgets, and save for family goals — all on your device.",
      },
      { name: "author", content: "Our Family Budget" },
      { property: "og:title", content: "Our Family Budget — Friendly offline budgeting" },
      {
        property: "og:description",
        content:
          "Track expenses, plan monthly budgets, and save for family goals together — offline and stress-free.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Our Family Budget — Friendly offline budgeting" },
      { name: "description", content: "Family Fund Flow is a simple, offline-first mobile web app for couples to track expenses and plan budgets." },
      { property: "og:description", content: "Family Fund Flow is a simple, offline-first mobile web app for couples to track expenses and plan budgets." },
      { name: "twitter:description", content: "Family Fund Flow is a simple, offline-first mobile web app for couples to track expenses and plan budgets." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3bd84fb3-35dc-45c7-8c69-21286fed44f8/id-preview-95d17439--547f90c9-b933-44ba-bcfd-d1878e8bc1d0.lovable.app-1777303119915.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3bd84fb3-35dc-45c7-8c69-21286fed44f8/id-preview-95d17439--547f90c9-b933-44ba-bcfd-d1878e8bc1d0.lovable.app-1777303119915.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <BudgetProvider>
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-background pb-24">
        <main className="flex-1 px-4">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
    </BudgetProvider>
  );
}
