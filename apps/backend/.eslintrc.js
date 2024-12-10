/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["@repo/eslint-config/nest.js", "plugin:drizzle/recommended"],
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["drizzle"],
};
