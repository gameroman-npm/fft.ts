import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    utils: "src/utils.ts",
    fast: "src/fast.ts",
  },
  exports: true,
  dts: true,
});
