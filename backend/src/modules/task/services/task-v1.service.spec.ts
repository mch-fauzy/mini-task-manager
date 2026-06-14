import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { AuditLog } from '../../../infrastructures/databases/entities/audit-log.entity';
import { Task } from '../../../infrastructures/databases/entities/task.entity';
import { createTestDataSource } from '../../../test/test-data-source';
import {
    AuditLogV1Repository,
    ICreateAuditLogParams,
} from '../../audit-log/repositories/audit-log-v1.repository';
import { TaskStatusConstant } from '../../../shared/constants/task-status.constant';
import { TaskV1Repository } from '../repositories/task-v1.repository';
import { TaskV1Service } from './task-v1.service';

describe('TaskV1Service', () => {
    let dataSource: DataSource;
    let taskRepository: TaskV1Repository;
    let auditLogRepository: AuditLogV1Repository;
    let service: TaskV1Service;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        taskRepository = new TaskV1Repository(dataSource);
        auditLogRepository = new AuditLogV1Repository(dataSource);
        service = new TaskV1Service(dataSource, taskRepository, auditLogRepository);
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    const countLogs = (): Promise<number> => dataSource.getRepository(AuditLog).count();
    const readStatus = async (id: string): Promise<string> =>
        (await dataSource.getRepository(Task).findOneOrFail({ where: { id } })).status;

    describe('create / list / delete', () => {
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

    describe('updateStatus', () => {
        it('advances one step, writes exactly one audit row, and reports the change', async () => {
            const task = await service.create('A');

            const result = await service.updateStatus(
                task.id,
                TaskStatusConstant.Pending,
                'john.doe',
            );

            expect(result.changed).toBe(true);
            expect(result.task.status).toBe(TaskStatusConstant.Pending);
            expect(await countLogs()).toBe(1);
            const [log] = await auditLogRepository.findByTaskId(task.id);
            expect(log.fromStatus).toBe(TaskStatusConstant.ToDo);
            expect(log.toStatus).toBe(TaskStatusConstant.Pending);
            expect(log.actorId).toBe('john.doe');
            expect(log.actorName).toBe('John Doe');
        });

        it('is idempotent: setting the current status is a no-op with no audit row', async () => {
            const task = await service.create('A');

            const result = await service.updateStatus(task.id, TaskStatusConstant.ToDo, 'john.doe');

            expect(result.changed).toBe(false);
            expect(result.task.status).toBe(TaskStatusConstant.ToDo);
            expect(await countLogs()).toBe(0);
        });

        it('rejects skipping a status and writes no audit row', async () => {
            const task = await service.create('A');

            await expect(
                service.updateStatus(task.id, TaskStatusConstant.InProgress, 'john.doe'),
            ).rejects.toThrow('Invalid status transition');
            expect(await readStatus(task.id)).toBe(TaskStatusConstant.ToDo);
            expect(await countLogs()).toBe(0);
        });

        it('rejects moving backward', async () => {
            const task = await service.create('A');
            await service.updateStatus(task.id, TaskStatusConstant.Pending, 'john.doe');

            await expect(
                service.updateStatus(task.id, TaskStatusConstant.ToDo, 'john.doe'),
            ).rejects.toThrow('Invalid status transition');
        });

        it('rejects an unknown actor before touching the task or the log', async () => {
            const task = await service.create('A');

            await expect(
                service.updateStatus(task.id, TaskStatusConstant.Pending, 'ghost'),
            ).rejects.toThrow('Unknown actor.');
            expect(await readStatus(task.id)).toBe(TaskStatusConstant.ToDo);
            expect(await countLogs()).toBe(0);
        });

        it('throws NotFound for a missing task', async () => {
            await expect(
                service.updateStatus(
                    '00000000-0000-0000-0000-000000000000',
                    TaskStatusConstant.Pending,
                    'john.doe',
                ),
            ).rejects.toThrow('Task not found.');
        });

        it('rolls back the status update when the audit insert fails (atomicity)', async () => {
            const task = await service.create('A');
            // Audit repository whose insert always fails, to force a mid-transaction error.
            const failingAuditRepository = {
                create: async (_params: ICreateAuditLogParams): Promise<AuditLog> => {
                    throw new Error('audit insert failed');
                },
            } as unknown as AuditLogV1Repository;
            const atomicService = new TaskV1Service(dataSource, taskRepository, failingAuditRepository);

            await expect(
                atomicService.updateStatus(task.id, TaskStatusConstant.Pending, 'john.doe'),
            ).rejects.toThrow('audit insert failed');
            // Both writes must be undone: status unchanged and no audit row persisted.
            expect(await readStatus(task.id)).toBe(TaskStatusConstant.ToDo);
            expect(await countLogs()).toBe(0);
        });
    });

    describe('listAuditLogs', () => {
        it('returns the task status history oldest-first', async () => {
            const task = await service.create('A');
            await service.updateStatus(task.id, TaskStatusConstant.Pending, 'john.doe');
            await service.updateStatus(task.id, TaskStatusConstant.InProgress, 'jane.roe');

            const logs = await service.listAuditLogs(task.id);

            expect(logs).toHaveLength(2);
            expect(logs[0].toStatus).toBe(TaskStatusConstant.Pending);
            expect(logs[1].toStatus).toBe(TaskStatusConstant.InProgress);
        });

        it('returns an empty list for a task with no status changes', async () => {
            const task = await service.create('A');

            expect(await service.listAuditLogs(task.id)).toEqual([]);
        });

        it('throws NotFound for a soft-deleted task', async () => {
            const task = await service.create('A');
            await service.updateStatus(task.id, TaskStatusConstant.Pending, 'john.doe');
            await service.delete(task.id);

            await expect(service.listAuditLogs(task.id)).rejects.toThrow('Task not found.');
        });

        it('throws NotFound for an unknown task', async () => {
            await expect(
                service.listAuditLogs('00000000-0000-0000-0000-000000000000'),
            ).rejects.toThrow('Task not found.');
        });
    });
});
