/// <reference types="vitest/config" />

import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(() => ({
  plugins: [react(), tailwindcss()],
  // В браузере прямой запрос к ngw.devices.sberbank.ru часто даёт ERR_CERT_AUTHORITY_INVALID
  // (корпоративный MITM, VPN, отличия доверенных УЦ). Прокси: браузер → localhost, TLS к Сберу — в Node.
  server: {
    proxy: {
      "/api/v2/oauth": {
        target: "https://ngw.devices.sberbank.ru:9443",
        changeOrigin: true,
        // Если и Node ругается на сертификат апстрима — оставьте false только для локальной разработки.
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@/app": path.resolve(import.meta.dirname, "./src/app"),
      "@/pages": path.resolve(import.meta.dirname, "./src/pages"),
      "@/widgets": path.resolve(import.meta.dirname, "./src/widgets"),
      "@/features": path.resolve(import.meta.dirname, "./src/features"),
      "@/entities": path.resolve(import.meta.dirname, "./src/entities"),
      "@/shared": path.resolve(import.meta.dirname, "./src/shared"),
    },
  },
  test: {
    bail: 1,
    clearMocks: true,
    coverage: {
      enabled: true,
      exclude: ["src/app/main.tsx"],
      include: ["src/**/*"],
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      thresholds: {
        "100": true,
      },
    },
    css: false,
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.ts?(x)"],
    setupFiles: [],
  },
}));
