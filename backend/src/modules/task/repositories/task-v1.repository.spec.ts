import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../../../test/test-data-source';
import { TaskV1Repository } from './task-v1.repository';
import { TaskStatusConstant } from '../constants/task-status.constant';

describe('TaskV1Repository', () => {
    let dataSource: DataSource;
    let repo: TaskV1Repository;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        repo = new TaskV1Repository(dataSource);
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('creates a task defaulting to to_do', async () => {
        const task = await repo.create('Prepare Invoice');
        expect(task.id).toBeDefined();
        expect(task.status).toBe(TaskStatusConstant.ToDo);
    });

    it('paginates and excludes soft-deleted tasks', async () => {
        const a = await repo.create('A');
        await repo.create('B');
        await repo.softDelete(a.id);
        const { items, total } = await repo.paginate({
            page: 1,
            perPage: 10,
            sort: 'created_at',
            order: 'ASC',
        });
        expect(total).toBe(1);
        expect(items.map((t) => t.title)).toEqual(['B']);
    });

    it('filters by a case-insensitive title search', async () => {
        await repo.create('Prepare Invoice');
        await repo.create('Send Report');
        const { items, total } = await repo.paginate({
            page: 1,
            perPage: 10,
            sort: 'created_at',
            order: 'ASC',
            search: 'invoice',
        });
        expect(total).toBe(1);
        expect(items.map((t) => t.title)).toEqual(['Prepare Invoice']);
    });

    it('treats LIKE wildcards in the search term as literals', async () => {
        await repo.create('100% Done');
        await repo.create('Other');
        const { items, total } = await repo.paginate({
            page: 1,
            perPage: 10,
            sort: 'created_at',
            order: 'ASC',
            search: '100%',
        });
        expect(total).toBe(1);
        expect(items.map((t) => t.title)).toEqual(['100% Done']);
    });

    it('findById returns null for a soft-deleted task', async () => {
        const a = await repo.create('A');
        await repo.softDelete(a.id);
        expect(await repo.findById(a.id)).toBeNull();
    });
});
