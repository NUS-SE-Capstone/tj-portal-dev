import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { ignores: ["dist/", "node_modules/", "public/", "src/style/", "src/assets/"] },
  { files: ["**/*.{js,mjs,cjs,vue}"], languageOptions: { globals: globals.browser } },
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    rules: {
      "no-unused-vars": "off",
      "no-useless-escape": "off",
      "no-self-assign": "off",
      "no-redeclare": "warn",
      "no-undef": "off",
      "no-dupe-keys": "warn",
      "no-empty": "off",
      "no-unreachable": "warn",
      "vue/multi-word-component-names": "off",
      "vue/valid-define-emits": "off",
      "vue/no-mutating-props": "off",
      "vue/require-valid-default-prop": "off",
      "vue/valid-v-on": "off",
      "vue/valid-v-for": "off",
      "vue/require-v-for-key": "warn",
      "vue/no-dupe-keys": "off",
      "vue/no-unused-vars": "off",
      "vue/no-useless-template-attributes": "off",
    },
  }
]);

