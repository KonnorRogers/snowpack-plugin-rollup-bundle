module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  ignorePatterns: ["__tests__/examples"],
  rules: {
    "no-useless-escape": 0,
  },
  plugins: ["@typescript-eslint", "prettier"]
};
