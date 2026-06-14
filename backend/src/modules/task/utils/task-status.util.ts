import { TASK_STATUS_VALUES, TaskStatus } from '../../../shared/constants/task-status.constant';

/**
 * Returns the status immediately after `current` in the fixed order, or null when
 * `current` is the final status (done). Single source of truth for "what comes next".
 */
function getNextStatus(current: TaskStatus): TaskStatus | null {
    const next = TASK_STATUS_VALUES[TASK_STATUS_VALUES.indexOf(current) + 1];
    return next ?? null;
}

/**
 * True only when moving from `from` to `to` advances exactly one step forward.
 * Skips, backward moves, and same-status no-ops all return false.
 */
export function isValidTransition(from: TaskStatus, to: TaskStatus): boolean {
    return getNextStatus(from) === to;
}
