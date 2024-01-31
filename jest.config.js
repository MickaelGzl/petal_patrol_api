/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  transform: {},
  testEnvironment: "node",
  transform: {
    "^.+\\.js$": "babel-jest", // Utilisez babel-jest pour transpiler le code ES6
  },
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
};
