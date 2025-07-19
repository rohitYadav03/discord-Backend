import globals from "globals";
import { defineConfig } from "eslint/config";
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },

    ignores: ["node_modules", "dist", ".env"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.node
    },
    rules: {
      "no-unused-vars": "warn",
      "semi": ["error", "always"],
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    }
  }
]);
