require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      'parserOptions': {
        'project': './tsconfig.json',
        'ecmaVersion': 2018,
        'sourceType': 'module'
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/typedef': 'off',
        '@typescript-eslint/no-wrapper-object-types': 'off',
        'no-unused-expressions': 'off',
        'prefer-const': 'off',
        'no-var': 'off',
        'no-case-declarations': 'off',
        'no-prototype-builtins': 'off',
        'no-misleading-character-class': 'off',
        'no-mixed-spaces-and-tabs': 'off',
        'react/self-closing-comp': 'off'
      }
    }
  ]
};
