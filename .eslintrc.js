module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  ignorePatterns: [
    "__tests__/example_dir",
  ],
  rules: {
    "no-useless-escape": 0
  },
  plugins: []
};
