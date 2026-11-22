import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const rootDir = fileURLToPath(new URL(".", import.meta.url));
const reactPath = path.resolve(rootDir, "node_modules/react");
const reactDomPath = path.resolve(rootDir, "node_modules/react-dom");

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    dedupe: ["react", "react-dom"],
    alias: {
      react: reactPath,
      "react-dom": reactDomPath,
    },
  },
  test: {
    environment: "jsdom",
  },
});
