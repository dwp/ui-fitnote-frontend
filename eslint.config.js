import dwpConfigBase from "@dwp/eslint-config-base";
import { globalIgnores } from "eslint/config";

export default [
  ...dwpConfigBase,
  {
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
  globalIgnores([
    "./assets/",
    "./public",
    "./node_modules",
    "./logs",
    "./gulp",
    ".gulpfile.js",
  ]),
];
