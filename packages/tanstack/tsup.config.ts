import { defineConfig } from "tsup"
import packageJSON from "./package.json"

export default defineConfig({
  outDir: "dist",
  entry: Object.values(packageJSON.exports["."]),
  format: [
    "type" in packageJSON && packageJSON.type === "module" ? "esm" : "cjs",
  ],
  splitting: false,
  sourcemap: false,
  clean: true,
  dts: true,
})
