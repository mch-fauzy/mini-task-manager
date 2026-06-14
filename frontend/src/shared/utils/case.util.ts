const toSnake = (s: string): string => s.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (s: string): string => s.replace(/_([a-z0-9])/g, (_m, c: string) => c.toUpperCase());

/**
 * Recursively re-key an object or array, leaving primitives, Date, and null or
 * undefined values untouched. Keeps the snake and camel mapping in one place.
 */
function transformKeys(value: unknown, keyFn: (k: string) => string): unknown {
    if (value === null || value === undefined) return value;
    if (value instanceof Date) return value;
    if (Array.isArray(value)) return value.map((v) => transformKeys(v, keyFn));
    if (typeof value === 'object') {
        return Object.fromEntries(
            Object.entries(value as Record<string, unknown>).map(([k, v]) => [keyFn(k), transformKeys(v, keyFn)]),
        );
    }
    return value;
}

// Deep-convert keys to snake_case for outgoing request bodies.
export const snakeCaseKeys = (value: unknown): unknown => transformKeys(value, toSnake);

// Deep-convert keys to camelCase for incoming responses.
export const camelCaseKeys = (value: unknown): unknown => transformKeys(value, toCamel);
