import 'express';
import { IPaginateMeta } from '../shared/interfaces/paginate.interface';

/**
 * Express augmentation:
 * - `validated*` carry Zod-parsed, camelCased input from the validate middleware
 *   (Express 5 makes `req.query` read-only, so parsed data lives on its own keys).
 * - `res.success` is the envelope helper installed by the response middleware.
 */
declare global {
    namespace Express {
        interface Request {
            validatedBody?: unknown;
            validatedQuery?: unknown;
            validatedParams?: unknown;
        }
        interface Response {
            success<T>(data: T, message: string, status?: number, meta?: IPaginateMeta): void;
        }
    }
}
