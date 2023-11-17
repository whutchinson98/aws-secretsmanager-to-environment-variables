/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
  preset: 'ts-jest',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      /* ts-jest config goes here in Jest */
      isolatedModules: true,
    }],
  },
  globals: {},
};
