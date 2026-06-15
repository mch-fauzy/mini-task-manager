import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { taskService } from '../services/task.service';
import { TaskStatus } from '../types/task.types';

interface IUpdateStatusVars {
    id: string;
    toStatus: TaskStatus;
    actorId: string;
}

// Refetch the task list and that task's audit log so both reflect the change.
export function useUpdateTaskStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (vars: IUpdateStatusVars) => taskService.updateStatus(vars.id, vars.toStatus, vars.actorId),
        onSuccess: (_data, vars) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
            queryClient.invalidateQueries({ queryKey: queryKeys.tasks.auditLogs(vars.id) });
        },
    });
}
