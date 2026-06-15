import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../shared/constants/query-keys.constant';
import { ITaskListParams, taskService } from '../services/task.service';

export function useTasks(params: ITaskListParams) {
    return useQuery({
        queryKey: queryKeys.tasks.list(params),
        queryFn: () => taskService.list(params),
        placeholderData: keepPreviousData, // keep the prior page visible while the next loads
    });
}
