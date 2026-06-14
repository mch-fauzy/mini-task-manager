import { describe, expect, it } from 'vitest';
import { TaskV1Response } from './task-v1.response';
import { Task } from '../../../../infrastructures/databases/entities/task.entity';
import { TaskStatusConstant } from '../../../../shared/constants/task-status.constant';

describe('TaskV1Response.MapEntity', () => {
    it('exposes id/title/status/status_label/timestamps and nulls absent dates', () => {
        const task = Object.assign(new Task(), {
            id: 't1',
            title: 'A',
            status: TaskStatusConstant.InProgress,
            createdAt: new Date('2026-01-01T00:00:00Z'),
            updatedAt: new Date('2026-01-02T00:00:00Z'),
            deletedAt: null,
        });
        expect(TaskV1Response.MapEntity(task)).toEqual({
            id: 't1',
            title: 'A',
            status: 'in_progress',
            statusLabel: 'In Progress',
            createdAt: task.createdAt,
            updatedAt: task.updatedAt,
        });
    });

    it('maps absent timestamps to null', () => {
        const task = Object.assign(new Task(), {
            id: 't2',
            title: 'B',
            status: TaskStatusConstant.ToDo,
            createdAt: undefined,
            updatedAt: undefined,
            deletedAt: null,
        });
        const mapped = TaskV1Response.MapEntity(task);
        expect(mapped.createdAt).toBeNull();
        expect(mapped.updatedAt).toBeNull();
    });
});
