import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ENTITIES } from '../infrastructures/databases/data-source';

/**
 * Fresh in-memory SQLite DataSource for tests. Uses `synchronize: true` so the
 * schema is built from the same `ENTITIES` array the app uses (production relies
 * on migrations instead). Each call yields an isolated database.
 */
export async function createTestDataSource(): Promise<DataSource> {
    const dataSource = new DataSource({
        type: 'better-sqlite3',
        database: ':memory:',
        entities: ENTITIES,
        namingStrategy: new SnakeNamingStrategy(),
        synchronize: true,
        dropSchema: true,
    });
    await dataSource.initialize();
    return dataSource;
}
