import axios from 'axios';
import { camelCaseKeys, snakeCaseKeys } from '../utils/case.util';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1',
    headers: { 'Content-Type': 'application/json' },
});

// Convert request keys from camelCase to snake_case. The one place outgoing casing is mapped.
apiClient.interceptors.request.use((config) => {
    if (config.data) config.data = snakeCaseKeys(config.data);
    if (config.params) config.params = snakeCaseKeys(config.params);
    return config;
});

// Convert response keys from snake_case to camelCase. The one place incoming casing is mapped.
apiClient.interceptors.response.use((response) => {
    if (response.data) response.data = camelCaseKeys(response.data);
    return response;
});
