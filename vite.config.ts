import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isBuild = process.argv.includes("build");

// Dev preview must use normal router rendering. Production builds enable
// TanStack Start SPA mode so Capacitor gets a static `dist/client/index.html`.
export default defineConfig({
  cloudflare: false,
  tanstackStart: isBuild
    ? {
        spa: {
          enabled: true,
        },
      }
    : {},
});
