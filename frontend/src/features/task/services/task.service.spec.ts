import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../../test/server';
import { taskService } from './task.service';

const BASE = 'http://localhost:3000/api/v1';

describe('taskService', () => {
    it('list maps snake_case envelope + meta to camelCase', async () => {
        server.use(
            http.get(`${BASE}/tasks`, ({ request }) => {
                const url = new URL(request.url);
                expect(url.searchParams.get('per_page')).toBe('10'); // request params were snake_cased
                return HttpResponse.json({
                    data: [
                        { id: 't1', title: 'A', status: 'to_do', status_label: 'To Do', created_at: 'x', updated_at: 'y' },
                    ],
                    meta: { total: 1, page: 1, per_page: 10, total_pages: 1 },
                    message: 'ok',
                });
            }),
        );
        const res = await taskService.list({ page: 1, perPage: 10, sort: 'created_at', order: 'DESC' });
        expect(res.data[0].statusLabel).toBe('To Do');
        expect(res.meta.totalPages).toBe(1);
    });

    it('updateStatus sends snake_case body', async () => {
        server.use(
            http.put(`${BASE}/tasks/t1/status`, async ({ request }) => {
                const body = (await request.json()) as Record<string, unknown>;
                expect(body).toEqual({ to_status: 'pending', actor_id: 'john.doe' });
                return HttpResponse.json({
                    data: {
                        id: 't1',
                        title: 'A',
                        status: 'pending',
                        status_label: 'Pending',
                        created_at: 'x',
                        updated_at: 'y',
                    },
                    message: 'ok',
                });
            }),
        );
        const task = await taskService.updateStatus('t1', 'pending', 'john.doe');
        expect(task.status).toBe('pending');
    });
});
