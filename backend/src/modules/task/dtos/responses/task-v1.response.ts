import { Task } from '../../../../infrastructures/databases/entities/task.entity';
import { TaskStatus, TaskStatusLabelConstant } from '../../../../shared/constants/task-status.constant';

export interface ITaskV1Response {
    id: string;
    title: string;
    status: TaskStatus;
    statusLabel: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}

/**
 * Shapes a Task entity for the API: controls which fields are exposed, adds the
 * human-readable status label, and uses null (never undefined) for absent dates.
 */
export class TaskV1Response {
    static MapEntity(task: Task): ITaskV1Response {
        return {
            id: task.id,
            title: task.title,
            status: task.status,
            statusLabel: TaskStatusLabelConstant[task.status],
            createdAt: task.createdAt ?? null,
            updatedAt: task.updatedAt ?? null,
        };
    }

    static MapEntities(tasks: Task[]): ITaskV1Response[] {
        return tasks.map((t) => this.MapEntity(t));
    }
}
