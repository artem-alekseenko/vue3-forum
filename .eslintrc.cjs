/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'airbnb-base',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  plugins: ['vue'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [['@', './src']],
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      },
    },
  },
  ignorePatterns: ['vitest.config.js'],
  rules: {
    'max-len': ['error', { code: 120 }],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
