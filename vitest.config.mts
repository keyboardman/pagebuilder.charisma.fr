import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  esbuild: {
    include: /\.[jt]sx?$/,
    loader: "tsx",
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./assets/test/setup.ts"],
    include: ["assets/**/*.{test,spec}.{ts,tsx}"],
    css: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "assets"),
      "@editeur": path.resolve(rootDir, "assets/editeur"),
    },
  },
});
