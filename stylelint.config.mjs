/** @type {import("stylelint").Config} */
export default {
  extends: ["stylelint-config-standard"],
  rules: {
    "selector-class-pattern": null,
  },
  ignoreFiles: ["dist/**", "node_modules/**"],
};
