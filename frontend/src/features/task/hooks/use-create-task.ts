import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { taskService } from '../services/task.service';

export function useCreateTask() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (title: string) => taskService.create(title),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all }),
    });
}
