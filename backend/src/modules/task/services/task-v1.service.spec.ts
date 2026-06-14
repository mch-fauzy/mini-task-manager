import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../../../test/test-data-source';
import { TaskV1Repository } from '../repositories/task-v1.repository';
import { TaskV1Service } from './task-v1.service';

describe('TaskV1Service (create/list/delete)', () => {
    let dataSource: DataSource;
    let service: TaskV1Service;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        service = new TaskV1Service(dataSource, new TaskV1Repository(dataSource));
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('creates and lists with pagination meta', async () => {
        await service.create('A');
        await service.create('B');
        const { items, total } = await service.list({
            page: 1,
            perPage: 1,
            sort: 'created_at',
            order: 'ASC',
        });
        expect(total).toBe(2);
        expect(items).toHaveLength(1);
    });

    it('soft-deletes a task so it leaves the list', async () => {
        const task = await service.create('A');
        await service.delete(task.id);
        const { total } = await service.list({
            page: 1,
            perPage: 10,
            sort: 'created_at',
            order: 'ASC',
        });
        expect(total).toBe(0);
    });

    it('throws NotFound when deleting a missing task', async () => {
        await expect(service.delete('00000000-0000-0000-0000-000000000000')).rejects.toThrow(
            'Task not found.',
        );
    });
});
