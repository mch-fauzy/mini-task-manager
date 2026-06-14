import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../../../test/test-data-source';
import { TaskStatusConstant } from '../../../shared/constants/task-status.constant';
import { AuditLogV1Repository } from './audit-log-v1.repository';

describe('AuditLogV1Repository', () => {
    let dataSource: DataSource;
    let repository: AuditLogV1Repository;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        repository = new AuditLogV1Repository(dataSource);
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('appends a log row capturing the transition, actor, and task', async () => {
        const log = await repository.create({
            taskId: 'task-1',
            actorId: 'john.doe',
            actorName: 'John Doe',
            fromStatus: TaskStatusConstant.ToDo,
            toStatus: TaskStatusConstant.Pending,
        });

        expect(log.id).toBeTruthy();
        expect(log.taskId).toBe('task-1');
        expect(log.actorName).toBe('John Doe');
        expect(log.fromStatus).toBe(TaskStatusConstant.ToDo);
        expect(log.toStatus).toBe(TaskStatusConstant.Pending);
        expect(log.createdAt).toBeInstanceOf(Date);
    });

    it('returns a task\'s logs in chronological order and scoped to that task', async () => {
        await repository.create({
            taskId: 'task-1',
            actorId: 'john.doe',
            actorName: 'John Doe',
            fromStatus: TaskStatusConstant.ToDo,
            toStatus: TaskStatusConstant.Pending,
        });
        await repository.create({
            taskId: 'task-1',
            actorId: 'jane.roe',
            actorName: 'Jane Roe',
            fromStatus: TaskStatusConstant.Pending,
            toStatus: TaskStatusConstant.InProgress,
        });
        await repository.create({
            taskId: 'task-2',
            actorId: 'john.doe',
            actorName: 'John Doe',
            fromStatus: TaskStatusConstant.ToDo,
            toStatus: TaskStatusConstant.Pending,
        });

        const logs = await repository.findByTaskId('task-1');

        expect(logs).toHaveLength(2);
        expect(logs[0].toStatus).toBe(TaskStatusConstant.Pending);
        expect(logs[1].toStatus).toBe(TaskStatusConstant.InProgress);
        expect(logs.every((log) => log.taskId === 'task-1')).toBe(true);
    });

    it('exposes no update or delete methods (the log is append-only)', () => {
        expect((repository as unknown as Record<string, unknown>).update).toBeUndefined();
        expect((repository as unknown as Record<string, unknown>).delete).toBeUndefined();
        expect((repository as unknown as Record<string, unknown>).softDelete).toBeUndefined();
    });
});
