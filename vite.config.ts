import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// We disable the Cloudflare Worker build and turn on TanStack Start's SPA mode
// so `vite build` produces a static `dist/client/index.html` that Capacitor
// can bundle into the Android app. The app is fully offline (LocalStorage),
// so we don't need SSR or a server runtime on device.
export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: {
      enabled: true,
    },
  },
});
