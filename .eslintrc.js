module.exports = {
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  // 为什么 global 中没有添加的全局变量，仍然可以使用，而不报错
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'react-app',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'react-hooks/exhaustive-deps': 0,
    'no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
  },
  plugins: ['@typescript-eslint', 'jsx-a11y', 'unused-imports', 'react-hooks'],
};

// plugins 用来扩展 eslint 的校验能力
// 但是 plugins 里面的校验规则需要在 rules 中进行配置才会在检测中被使用
// 一般一个插件包含很多校验，如果所有规则都要一一配置在 rules 里面会很麻烦
// 所以一般跟随 eslint-plugin-***  的，还会存在 eslint-config-***，这个即是插件官方提供的 rules 的推荐配置
// 还有一些其他插件的推荐配置是与 eslint-plugin  放在一起的，所以看到在 extends 配置项中即包含 eslint-config，也会包含eslint-plugin
