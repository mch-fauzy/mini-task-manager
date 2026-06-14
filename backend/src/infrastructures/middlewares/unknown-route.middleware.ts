import { NextFunction, Request, Response } from 'express';
import { NotFoundException } from '../../shared/exceptions/http.exception';

/**
 * Fallback for requests that match no route. Express does not throw on an
 * unmatched route.
 */
export function unknownRouteHandler(req: Request, _res: Response, next: NextFunction): void {
    next(new NotFoundException('Route not found.', `No route matches ${req.method} ${req.originalUrl}.`));
}
