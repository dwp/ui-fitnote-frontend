import dwpConfigBase from "@dwp/eslint-config-mocha";

export default [
  ...dwpConfigBase,
  {
    languageOptions: {
      ecmaVersion: 2022,
    },
  },
];
