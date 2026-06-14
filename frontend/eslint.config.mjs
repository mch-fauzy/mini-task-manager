import tseslint from 'typescript-eslint';

// Flat ESLint config. Naming discipline mirrors the backend for cross-workspace
// consistency: interfaces are `I`-prefixed PascalCase, other type-likes PascalCase.
export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'coverage'] },
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'no-console': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                },
            ],
            '@typescript-eslint/naming-convention': [
                'error',
                { selector: 'interface', format: ['PascalCase'], prefix: ['I'] },
                { selector: 'typeLike', format: ['PascalCase'] },
            ],
        },
    },
    {
        // Declaration files (e.g. vite-env.d.ts) reference third-party types and
        // should not be held to the interface naming rule.
        files: ['**/*.d.ts'],
        rules: { '@typescript-eslint/naming-convention': 'off' },
    },
);
