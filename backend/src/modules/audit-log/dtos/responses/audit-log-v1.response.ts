import { AuditLog } from '../../../../infrastructures/databases/entities/audit-log.entity';
import { TaskStatus, TaskStatusLabelConstant } from '../../../../shared/constants/task-status.constant';

export interface IAuditLogV1Response {
    id: string;
    taskId: string;
    actorId: string;
    actorName: string;
    fromStatus: TaskStatus;
    fromStatusLabel: string;
    toStatus: TaskStatus;
    toStatusLabel: string;
    createdAt: Date;
}

/**
 * Shapes an AuditLog entity for the API. Adds a human-readable label for both ends of
 * the transition (mirrors the task response) so the change history renders without the
 * client re-deriving labels. Read-only by design: the log is never mutated.
 */
export class AuditLogV1Response {
    static MapEntity(log: AuditLog): IAuditLogV1Response {
        return {
            id: log.id,
            taskId: log.taskId,
            actorId: log.actorId,
            actorName: log.actorName,
            fromStatus: log.fromStatus,
            fromStatusLabel: TaskStatusLabelConstant[log.fromStatus],
            toStatus: log.toStatus,
            toStatusLabel: TaskStatusLabelConstant[log.toStatus],
            createdAt: log.createdAt,
        };
    }

    static MapEntities(logs: readonly AuditLog[]): IAuditLogV1Response[] {
        return logs.map((log) => this.MapEntity(log));
    }
}
