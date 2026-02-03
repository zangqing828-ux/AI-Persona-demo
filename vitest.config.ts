import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@platform": path.resolve(import.meta.dirname, "platform"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: [],
    include: ["**/__tests__/**/*.test.{ts,tsx}"],
    css: false,
    root: ".",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
