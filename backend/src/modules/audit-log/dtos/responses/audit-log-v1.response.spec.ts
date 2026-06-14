import { describe, expect, it } from 'vitest';
import { AuditLog } from '../../../../infrastructures/databases/entities/audit-log.entity';
import { TaskStatusConstant } from '../../../../shared/constants/task-status.constant';
import { AuditLogV1Response } from './audit-log-v1.response';

describe('AuditLogV1Response', () => {
    const log: AuditLog = {
        id: 'log-1',
        taskId: 'task-1',
        actorId: 'john.doe',
        actorName: 'John Doe',
        fromStatus: TaskStatusConstant.ToDo,
        toStatus: TaskStatusConstant.Pending,
        createdAt: new Date('2026-01-01T10:00:00Z'),
    };

    it('maps an entity and adds a label for both ends of the transition', () => {
        const dto = AuditLogV1Response.MapEntity(log);

        expect(dto).toMatchObject({
            id: 'log-1',
            taskId: 'task-1',
            actorId: 'john.doe',
            actorName: 'John Doe',
            fromStatus: 'to_do',
            fromStatusLabel: 'To Do',
            toStatus: 'pending',
            toStatusLabel: 'Pending',
        });
        expect(dto.createdAt).toBe(log.createdAt);
    });

    it('maps a list preserving order', () => {
        const dtos = AuditLogV1Response.MapEntities([log]);

        expect(dtos).toHaveLength(1);
        expect(dtos[0].id).toBe('log-1');
    });
});
