/** Centralized error messages so wording stays consistent across the API. */
export const ErrorMessageConstant = {
    TaskNotFound: 'Task not found.',
    UnknownActor: 'Unknown actor.',
    InvalidTransition: (from: string, to: string) =>
        `Invalid status transition from "${from}" to "${to}". Status must advance one step in order.`,
} as const;
