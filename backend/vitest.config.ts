import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

// SWC transforms TS at test time so TypeORM's decorators + emitted metadata work
// under Vitest (tsx/esbuild alone do not emit decorator metadata).
export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.spec.ts'],
        coverage: {
            provider: 'v8',
            include: ['src/**/*.ts'],
            exclude: [
                'src/main.ts',
                'src/**/*.spec.ts',
                'src/test/**',
                'src/types/**',
                'src/**/*.interface.ts',
                'src/infrastructures/databases/migrations/**',
            ],
        },
    },
    plugins: [swc.vite({ module: { type: 'es6' } })],
});
