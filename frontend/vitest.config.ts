import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
    exclude: [
      "**/node_modules/**",
      "**/dist/**",
      "**/e2e/**", // Playwright E2E 테스트 제외
      "tests/e2e/**", // tests/e2e 폴더 제외
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
