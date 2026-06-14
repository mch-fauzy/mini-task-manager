export const queryKeys = {
    tasks: {
        all: ['tasks'] as const,
        list: (params: unknown) => ['tasks', 'list', params] as const,
        auditLogs: (id: string) => ['tasks', id, 'audit-logs'] as const,
    },
    actors: { all: ['actors'] as const },
};
