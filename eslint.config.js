// eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginVue from "eslint-plugin-vue";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [".nuxt/**", ".output/**"],
  },
  { 
    languageOptions: { 
      globals: {
        ...globals.browser,
        ...globals.node,
      } 
    } 
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs["flat/recommended"],
  eslintConfigPrettier,
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-v-model-argument': 'off',
      'vue/no-mutating-props': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-undef': 'warn'
    },
  },
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
];