//=============================================================================
//Licensed Materials - Property of Bambee
//(C) Copyright Bambee 2019,2021
//All Rights Reserved
//=============================================================================

const fs = require('fs');

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['@loopback/eslint-config'],
  parserOptions: {
    sourceType: 'module',
    /*
     * The `project` setting is required for `@typescript-eslint/await-thenable`
     * but it causes significant performance overhead (1m13s vs 13s)
     * See https://github.com/typescript-eslint/typescript-eslint/issues/389
     */
    project: getProjectFile(),
    ecmaFeatures: {
      ecmaVersion: 2017,
      jsx: false,
    },
    noWatch: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier',
  ],
  plugins: ['eslint-plugin', '@typescript-eslint', 'mocha', 'import'],
  env: {
    mocha: true,
    node: true,
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'warn',
      {
        devDependencies: [
          '**/*.test.ts',
          '**/*.acceptance.ts',
          '**/acceptance/**',
          '**/*.docker.ts',
          '**/*.unit.ts',
          '**/__tests__/**',
          'TestContext.ts',
          '**/lib/test-helper.ts',
        ],
        optionalDependencies: false,
        peerDependencies: false,
      },
    ],
    '@typescript-eslint/no-namespace': 0,
    '@typescript-eslint/naming-convention': 0,
    '@typescript-eslint/interface-name-prefix': 0, // off because we're okay with ISomeName versus SomeNameInterface
    '@typescript-eslint/camelcase': 0, // off because of all the existing mongoose models.
    'require-atomic-updates': 0, // off because we use async/await and this rule is still broken
    'no-prototype-builtins': 0,
  },
  overrides: [
    {
      files: ['*.unit.ts', 'src/__tests__/**', '*.test.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
      },
    },
    {
      files: ['**/generated/**', '**/*/generated.ts'],
      rules: {
        'no-void': 0,
      },
    },
    {
      files: ['src/**/*.ts', 'src/**/*.js'],
      rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-var-requires': 'off',
        'no-useless-escape': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
    {
      files: ['src/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      }
    }
  ],
};

/**
 * Detect tsconfig file
 */
function getProjectFile() {
  if (fs.existsSync('./tsconfig.build.json')) return './tsconfig.build.json';
  if (fs.existsSync('./tsconfig.json')) return './tsconfig.json';
  return undefined;
}
