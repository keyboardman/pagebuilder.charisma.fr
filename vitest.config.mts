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
    coverage: {
      provider: "v8",
      include: ["assets/**/*.{ts,tsx,js,jsx}"],
      exclude: [
        "node_modules/**",
        "vendor/**",
        "**/node_modules/**",
        "**/vendor/**",
        "assets/**/*.{test,spec}.{ts,tsx}",
        "assets/test/**",
      ],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(rootDir, "assets"),
      "@editeur": path.resolve(rootDir, "assets/editeur"),
    },
  },
});
