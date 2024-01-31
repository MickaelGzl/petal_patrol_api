module.exports = {
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
};
