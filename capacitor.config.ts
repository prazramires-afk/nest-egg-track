import type { CapacitorConfig } from "@capacitor/cli";

// `vite build` produces a static SPA in `dist/client` (TanStack Start SPA mode).
// The `postbuild` npm script renames `_shell.html` to `index.html` so Capacitor
// can find an entry point. Run `npm run build && npx cap sync android`.
const config: CapacitorConfig = {
  appId: "app.lovable.ourfamilybudget",
  appName: "Our Family Budget",
  webDir: "dist/client",
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
