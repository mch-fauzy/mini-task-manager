// Allowed list sort fields and orders. Single source for ITaskListParams and the
// URL parser in use-task-list-params.
export const TASK_SORT_FIELDS = ['created_at', 'updated_at', 'status', 'title'] as const;
export const TASK_SORT_ORDERS = ['ASC', 'DESC'] as const;
