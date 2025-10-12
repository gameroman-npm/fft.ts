import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    "fft-js": "src/fft-js/index.ts",
    "fft.js": "src/fft.js/index.ts",
    fftjs: "src/fftjs/index.ts",
  },
  exports: true,
  unbundle: true,
  dts: true,
});
