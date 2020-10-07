module.exports = {
  env: {
    browser: true,
    es2020: true,
    "cypress/globals": true
  },
  extends: ["eslint:recommended", "plugin:cypress/recommended"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  ignorePatterns: [
    "__tests__/examples",
  ],
  rules: {
    "no-useless-escape": 0
  },
  plugins: ["cypress"]
};
