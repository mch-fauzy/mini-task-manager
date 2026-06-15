import { TASK_STATUS_LABELS, TASK_STATUS_ORDER } from '../constants/task-status.constant';
import { TaskStatus } from '../types/task.types';

// Immediate next status, or null when already at the final status.
export function getNextStatus(current: TaskStatus): TaskStatus | null {
    const index = TASK_STATUS_ORDER.indexOf(current);
    return index >= 0 && index < TASK_STATUS_ORDER.length - 1 ? TASK_STATUS_ORDER[index + 1] : null;
}

export interface IStatusOption {
    value: TaskStatus;
    label: string;
    disabled: boolean;
}

/**
 * Build the select options for a status change, enabling only the immediate
 * next status. UX guard only: the backend re-validates and stays authoritative.
 */
export function buildStatusOptions(current: TaskStatus): IStatusOption[] {
    const next = getNextStatus(current);
    return TASK_STATUS_ORDER.map((status) => ({
        value: status,
        label: TASK_STATUS_LABELS[status],
        disabled: status !== next,
    }));
}
