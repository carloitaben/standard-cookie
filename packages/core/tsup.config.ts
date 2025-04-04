import { defineConfig } from "tsup"

export default defineConfig({
  outDir: "dist",
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
})
