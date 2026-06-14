/** Centralized success messages returned in the response envelope. */
export const SuccessMessageConstant = {
    Healthy: 'Service is healthy.',
    TaskCreated: 'Task created successfully.',
    TasksRetrieved: 'Tasks retrieved successfully.',
    TaskDeleted: 'Task deleted successfully.',
    TaskStatusUpdated: 'Task status updated successfully.',
    TaskStatusUnchanged: 'Task status unchanged.',
    AuditLogsRetrieved: 'Audit logs retrieved successfully.',
    ActorsRetrieved: 'Actors retrieved successfully.',
} as const;
