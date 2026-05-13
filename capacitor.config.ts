import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.ourfamilybudget",
  appName: "Our Family Budget",
  // After `bun run build`, the static client assets land in `.output/public`.
  // Capacitor copies that folder into the Android project on `cap sync`.
  webDir: ".output/public",
  bundledWebRuntime: false,
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: "https",
  },
};

export default config;
