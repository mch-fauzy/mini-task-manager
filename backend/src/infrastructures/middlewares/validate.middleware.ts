import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodType } from 'zod';
import { camelCaseKeys } from '../../shared/utils/string.util';

type Source = 'body' | 'query' | 'params';

/**
 * Validate one request source against a Zod schema. The raw input is camelCased
 * first (the wire is snake_case), then parsed; the result is written to
 * `req.validated{Body,Query,Params}`. A ZodError thrown by parse propagates to the
 * global error middleware, which formats the 400 response. This relies on Express 5
 * automatically forwarding synchronous throws from a handler to the error middleware.
 */
export function validate(schema: ZodType, source: Source = 'body'): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction) => {
        const raw = source === 'query' ? req.query : source === 'params' ? req.params : req.body;
        const parsed = schema.parse(camelCaseKeys(raw));
        if (source === 'query') req.validatedQuery = parsed;
        else if (source === 'params') req.validatedParams = parsed;
        else req.validatedBody = parsed;
        next();
    };
}
