import { NextFunction, Request, Response } from 'express';
import { logger } from '../../shared/utils/logger.util';

/** Logs `METHOD path status durationMs` once each response finishes. */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();
    res.on('finish', () => {
        logger.info(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
}
