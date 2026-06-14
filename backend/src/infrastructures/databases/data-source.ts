import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { config } from '../../config';
import { Task } from './entities/task.entity';

/**
 * Entities registered with TypeORM. Reused by the in-memory test DataSource so
 * the test schema matches production.
 */
const ENTITIES = [Task];

/**
 * App DataSource (file-backed SQLite). synchronize is off so schema changes go
 * through migrations. SnakeNamingStrategy maps camelCase fields to snake_case columns.
 */
export const AppDataSource = new DataSource({
    type: 'better-sqlite3',
    database: config.db.database,
    entities: ENTITIES,
    migrations: ['src/infrastructures/databases/migrations/*.ts'],
    namingStrategy: new SnakeNamingStrategy(),
    synchronize: false,
    logging: !config.isProduction ? ['error', 'warn'] : false,
});
