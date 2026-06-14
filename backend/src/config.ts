import 'dotenv/config';
import { z } from 'zod';

/** Environment schema. The only place env is read; fails fast on bad config. */
const EnvSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    APP_PORT: z.coerce.number().int().positive().default(3000),
    DB_DATABASE: z
        .string()
        .min(1, { error: 'DB_DATABASE is required' })
        .default('./data/task-manager.sqlite'),
    CORS_ORIGIN: z.string().optional(),
});

/** Parse and shape the typed config. Throws on invalid env; env arg keeps it testable. */
export function loadConfig(env: NodeJS.ProcessEnv = process.env) {
    const parsed = EnvSchema.safeParse(env);
    if (!parsed.success) {
        throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
    }
    const e = parsed.data;
    // Comma-separated allowlist of origins; unset means reflect any origin (fine for
    // local dev and an unauthenticated API). Restrict via CORS_ORIGIN in production.
    const corsOrigin = e.CORS_ORIGIN ? e.CORS_ORIGIN.split(',').map((o) => o.trim()) : true;
    return {
        nodeEnv: e.NODE_ENV,
        isProduction: e.NODE_ENV === 'production',
        app: { port: e.APP_PORT },
        db: { database: e.DB_DATABASE },
        cors: { origin: corsOrigin },
    } as const;
}

/** App-wide config singleton. Access env only through this object. */
export const config = loadConfig();
