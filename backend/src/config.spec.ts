import { describe, it, expect } from 'vitest';
import { loadConfig } from './config';

describe('loadConfig', () => {
    it('parses valid env with defaults', () => {
        const config = loadConfig({ NODE_ENV: 'test', DB_DATABASE: ':memory:' });
        expect(config.app.port).toBe(3000);
        expect(config.db.database).toBe(':memory:');
        expect(config.nodeEnv).toBe('test');
    });

    it('throws when APP_PORT is non-numeric', () => {
        expect(() => loadConfig({ APP_PORT: 'abc', DB_DATABASE: ':memory:' })).toThrow();
    });

    it('defaults CORS origin to any when CORS_ORIGIN is unset', () => {
        const config = loadConfig({ NODE_ENV: 'test', DB_DATABASE: ':memory:' });
        expect(config.cors.origin).toBe(true);
    });

    it('parses CORS_ORIGIN into a trimmed origin allowlist', () => {
        const config = loadConfig({
            NODE_ENV: 'test',
            DB_DATABASE: ':memory:',
            CORS_ORIGIN: 'http://localhost:5173, https://app.example.com',
        });
        expect(config.cors.origin).toEqual(['http://localhost:5173', 'https://app.example.com']);
    });
});
