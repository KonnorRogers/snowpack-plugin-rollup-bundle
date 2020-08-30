module.exports = {
  env: {
    browser: true,
    es2020: true,
    "jest/globals": true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "plugin:testing-library/recommended"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  ignorePatterns: [
    "__tests__/example_dir"
  ],
  rules: {},
  plugins: ["jest", "testing-library"]
};
