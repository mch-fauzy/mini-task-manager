import { TaskStatus } from '../types/task.types';

// Forward-only order, kept in sync with the backend state machine.
export const TASK_STATUS_ORDER: TaskStatus[] = ['to_do', 'pending', 'in_progress', 'done'];

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
    to_do: 'To Do',
    pending: 'Pending',
    in_progress: 'In Progress',
    done: 'Done',
};

// Ant Design Tag colors per status.
export const TASK_STATUS_COLORS: Record<TaskStatus, string> = {
    to_do: 'default',
    pending: 'gold',
    in_progress: 'blue',
    done: 'green',
};
