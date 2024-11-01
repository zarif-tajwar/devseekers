import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/**.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  // https://github.com/egoist/tsup/issues/619
  noExternal: [/(.*)/],
  outDir: "dist",
  bundle: true,
  format: ["cjs", "esm"],
  treeshake: false,
  platform: "node",
  target: "node16",
  dts: true,
});
