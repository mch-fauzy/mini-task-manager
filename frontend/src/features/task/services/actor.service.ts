import { apiClient } from '../../../shared/lib/api-client';
import { IApiResponse } from '../../../shared/types/api.types';
import { IActor } from '../types/task.types';

export const actorService = {
    async list(): Promise<IActor[]> {
        const res = await apiClient.get<IApiResponse<IActor[]>>('/actors');
        return res.data.data;
    },
};
