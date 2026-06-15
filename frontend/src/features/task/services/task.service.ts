import { apiClient } from '../../../shared/lib/api-client';
import { IApiResponse, IPaginatedResponse } from '../../../shared/types/api.types';
import { TASK_SORT_FIELDS, TASK_SORT_ORDERS } from '../constants/task-list.constant';
import { IAuditLog, ITask, TaskStatus } from '../types/task.types';

export interface ITaskListParams {
    page: number;
    perPage: number;
    sort: (typeof TASK_SORT_FIELDS)[number];
    order: (typeof TASK_SORT_ORDERS)[number];
    search?: string;
}

// Data access only. The api-client interceptors map camelCase <-> snake_case.
export const taskService = {
    async list(params: ITaskListParams): Promise<IPaginatedResponse<ITask>> {
        const res = await apiClient.get<IPaginatedResponse<ITask>>('/tasks', { params });
        return res.data;
    },
    async create(title: string): Promise<ITask> {
        const res = await apiClient.post<IApiResponse<ITask>>('/tasks', { title });
        return res.data.data;
    },
    async updateStatus(id: string, toStatus: TaskStatus, actorId: string): Promise<ITask> {
        const res = await apiClient.put<IApiResponse<ITask>>(`/tasks/${id}/status`, { toStatus, actorId });
        return res.data.data;
    },
    async remove(id: string): Promise<void> {
        await apiClient.delete(`/tasks/${id}`);
    },
    async auditLogs(id: string): Promise<IAuditLog[]> {
        const res = await apiClient.get<IApiResponse<IAuditLog[]>>(`/tasks/${id}/audit-logs`);
        return res.data.data;
    },
};
