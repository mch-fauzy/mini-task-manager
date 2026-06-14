import cors from 'cors';
import express, { Express } from 'express';
import helmet from 'helmet';
import { DataSource } from 'typeorm';
import { config } from './config';
import { requestLogger } from './infrastructures/middlewares/request-logger.middleware';
import { responseMiddleware } from './infrastructures/middlewares/response.middleware';
import { unknownRouteHandler } from './infrastructures/middlewares/unknown-route.middleware';
import { createHealthRouter } from './modules/health/health.module';
import { createTaskRouter } from './modules/task/task.module';
import { errorFilter } from './shared/filters/error.filter';

/**
 * Compose the Express app. Middleware runs in this order: security headers, cors,
 * json body parser, request logger, response helper, versioned module routers,
 * unknown-route handler, then the error filter which must be registered last. Takes
 * the DataSource so module factories can build their repositories.
 */
export function createApp(dataSource: DataSource): Express {
    const app = express();
    app.use(helmet());
    app.use(cors({ origin: config.cors.origin }));
    app.use(express.json({ limit: '100kb' }));
    app.use(requestLogger);
    app.use(responseMiddleware);

    app.use('/api/v1/health', createHealthRouter());
    app.use('/api/v1/tasks', createTaskRouter(dataSource));

    app.use(unknownRouteHandler);
    app.use(errorFilter); // MUST be registered last
    return app;
}
