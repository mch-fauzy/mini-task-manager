/** The four task statuses, in their fixed forward order. Single source of truth. */
export const TaskStatusConstant = {
    ToDo: 'to_do',
    Pending: 'pending',
    InProgress: 'in_progress',
    Done: 'done',
} as const;

export type TaskStatus = (typeof TaskStatusConstant)[keyof typeof TaskStatusConstant];

/**
 * The status values as a literal tuple, in their fixed forward order. Single ordered
 * source of truth: used both as the Zod enum for request validation and by the state
 * machine to derive the next valid status.
 */
export const TASK_STATUS_VALUES = [
    TaskStatusConstant.ToDo,
    TaskStatusConstant.Pending,
    TaskStatusConstant.InProgress,
    TaskStatusConstant.Done,
] as const;

/** Human-readable labels for UI display. */
export const TaskStatusLabelConstant: Record<TaskStatus, string> = {
    [TaskStatusConstant.ToDo]: 'To Do',
    [TaskStatusConstant.Pending]: 'Pending',
    [TaskStatusConstant.InProgress]: 'In Progress',
    [TaskStatusConstant.Done]: 'Done',
};
