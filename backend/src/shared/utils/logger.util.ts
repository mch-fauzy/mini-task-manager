/* eslint-disable no-console */

/**
 * Minimal logging seam. Centralizes process output so the implementation can be
 * swapped (e.g. for pino) without touching call sites.
 */
export const logger = {
    info: (message: string, ...meta: unknown[]): void => console.info(message, ...meta),
    warn: (message: string, ...meta: unknown[]): void => console.warn(message, ...meta),
    error: (message: string, ...meta: unknown[]): void => console.error(message, ...meta),
};
