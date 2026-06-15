// Forward-only status sequence. Mirrors the backend domain union (source of truth).
export type TaskStatus = 'to_do' | 'pending' | 'in_progress' | 'done';

export interface ITask {
    id: string;
    title: string;
    status: TaskStatus;
    statusLabel: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAuditLog {
    id: string;
    taskId: string;
    actorId: string;
    actorName: string;
    fromStatus: TaskStatus;
    fromStatusLabel: string;
    toStatus: TaskStatus;
    toStatusLabel: string;
    createdAt: string;
}

export interface IActor {
    id: string;
    name: string;
}
