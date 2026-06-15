import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { taskService } from '../services/task.service';

// Fetch a task's audit log only when a task is selected (taskId is non-null).
export function useTaskAuditLogs(taskId: string | null) {
    return useQuery({
        queryKey: queryKeys.tasks.auditLogs(taskId),
        queryFn: () => taskService.auditLogs(taskId!),
        enabled: Boolean(taskId),
    });
}
