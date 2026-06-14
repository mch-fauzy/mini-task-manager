import 'reflect-metadata';
import { createApp } from './app';
import { config } from './config';
import { AppDataSource } from './infrastructures/databases/data-source';
import { logger } from './shared/utils/logger.util';

/** Initialize the DataSource, build the app, and start listening. */
async function bootstrap(): Promise<void> {
    await AppDataSource.initialize();
    const app = createApp(AppDataSource);
    app.listen(config.app.port, () => {
        logger.info(`API listening on http://localhost:${config.app.port}/api/v1`);
    });
}

bootstrap().catch((err) => {
    logger.error('Failed to start application', err);
    process.exit(1);
});
