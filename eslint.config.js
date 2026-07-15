const tseslint = require("typescript-eslint");
const prettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  }
);