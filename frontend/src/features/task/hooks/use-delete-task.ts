import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { taskService } from '../services/task.service';

// Soft delete on the backend: the row leaves the list but its audit log is retained.
export function useDeleteTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => taskService.remove(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
    });
}
