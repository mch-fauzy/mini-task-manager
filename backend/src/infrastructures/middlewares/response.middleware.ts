import { NextFunction, Request, Response } from 'express';
import { IBasicResponse } from '../../shared/interfaces/basic-response.interface';
import { snakeCaseKeys } from '../../shared/utils/string.util';

/**
 * Installs `res.success(data, message, status?, meta?)`, the single place that
 * builds the success envelope `{ data, message }` (+ `meta` for lists) and
 * snake_cases the payload keys for the wire. Controllers stay in camelCase.
 */
export function responseMiddleware(_req: Request, res: Response, next: NextFunction): void {
    res.success = (data, message, status = 200, meta) => {
        const envelope: IBasicResponse<unknown> = { data, message };
        if (meta) envelope.meta = meta;
        res.status(status).json(snakeCaseKeys(envelope));
    };
    next();
}
