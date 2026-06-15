import tseslint from 'typescript-eslint';

// Flat ESLint config. Naming discipline carried from the reference backend:
// interfaces are `I`-prefixed PascalCase; other type-likes are PascalCase.
export default tseslint.config(
    { ignores: ['dist', 'node_modules', 'coverage'] },
    ...tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'no-console': 'warn',
            // Allow intentionally-unused, underscore-prefixed args (e.g. the 4th
            // `_next` param Express needs to detect error-handling middleware).
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
        // Declaration-merging files augment third-party interfaces (Express
        // Request/Response) and must keep their original names.
        files: ['**/*.d.ts'],
        rules: { '@typescript-eslint/naming-convention': 'off' },
    },
);
