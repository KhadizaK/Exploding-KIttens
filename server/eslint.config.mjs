import globals from "globals";
import pluginReact from "eslint-plugin-react";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,jsx}"] },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginReact.configs.flat.recommended,

  // {plugins: {
  //   react: pluginReact,
  //   prettier: prettierConfig
  // },
  // rules: {
  //   ...pluginReact.configs.recommended.rules,
  //   "prettier/prettier": "error" //Enforces Prettier formatting
  // }
  // },
];
