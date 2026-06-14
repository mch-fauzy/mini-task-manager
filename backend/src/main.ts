import 'reflect-metadata';
import { createApp } from './app';
import { config } from './config';
import { AppDataSource } from './infrastructures/databases/data-source';
import { logger } from './shared/utils/logger.util';

/** Max time to wait for in-flight requests to drain before forcing exit. */
const SHUTDOWN_TIMEOUT_MS = 10_000;

/** Initialize the DataSource, build the app, start listening, and wire shutdown. */
async function bootstrap(): Promise<void> {
    await AppDataSource.initialize();
    const app = createApp(AppDataSource);
    const server = app.listen(config.app.port, () => {
        logger.info(`API listening on http://localhost:${config.app.port}/api/v1`);
    });

    // Graceful shutdown: stop accepting new connections, then close the DB so a deploy
    // or orchestrator restart never cuts an in-flight request or leaks the SQLite handle.
    const shutdown = (signal: string): void => {
        logger.info(`Received ${signal}, shutting down gracefully`);
        // Force exit if draining stalls, so a hung keep-alive request cannot block the restart.
        const forceExit = setTimeout(() => {
            logger.error('Graceful shutdown timed out, forcing exit');
            process.exit(1);
        }, SHUTDOWN_TIMEOUT_MS);
        forceExit.unref();
        server.close(() => {
            AppDataSource.destroy()
                .catch((err) => logger.error('Failed to close the database', err))
                .finally(() => {
                    clearTimeout(forceExit);
                    process.exit(0);
                });
        });
    };
    for (const signal of ['SIGTERM', 'SIGINT'] as const) {
        process.on(signal, () => shutdown(signal));
    }
}

bootstrap().catch((err) => {
    logger.error('Failed to start application', err);
    process.exit(1);
});
