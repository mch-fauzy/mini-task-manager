import { NextFunction, Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';
import { ZodError } from 'zod';
import { config } from '../../config';
import { HttpException } from '../exceptions/http.exception';
import { snakeCaseKeys } from '../utils/string.util';

/** Flatten a ZodError into { field: [messages] }, snake_cased for the wire. */
function formatZodError(error: ZodError): Record<string, string[]> {
    const out: Record<string, string[]> = {};
    for (const issue of error.issues) {
        const key = issue.path.map((p) => String(p)).join('.') || '_';
        (out[key] ??= []).push(issue.message);
    }
    return snakeCaseKeys(out) as Record<string, string[]>;
}

/**
 * Central error filter, registered last. Maps typed domain exceptions, Zod
 * validation errors, and TypeORM errors to clean envelopes. Raw error details
 * are hidden in production to avoid leaking internals.
 */
export function errorFilter(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void {
    if (err instanceof HttpException) {
        res.status(err.status).json({
            message: err.message,
            ...(err.error !== undefined && { error: err.error }),
        });
        return;
    }
    if (err instanceof ZodError) {
        res.status(400).json({ message: 'Validation Error', errors: formatZodError(err) });
        return;
    }
    if (err instanceof EntityNotFoundError) {
        res.status(404).json({ message: 'Not Found', error: 'Resource not found.' });
        return;
    }
    if (err instanceof QueryFailedError) {
        res.status(500).json({
            message: 'Query Error',
            error: config.isProduction ? 'Query Error' : err.message,
        });
        return;
    }
    res.status(500).json({
        message: 'Internal Server Error',
        error: config.isProduction ? 'Internal Server Error' : String(err),
    });
}
