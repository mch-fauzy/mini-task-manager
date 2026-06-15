import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../../test/server';
import { AuditLogModal } from './audit-log-modal';

const BASE = 'http://localhost:3000/api/v1';

describe('AuditLogModal', () => {
    it('renders audit entries chronologically and read-only', async () => {
        server.use(
            http.get(`${BASE}/tasks/t1/audit-logs`, () =>
                HttpResponse.json({
                    data: [
                        { id: 'l1', task_id: 't1', actor_id: 'john.doe', actor_name: 'John Doe', from_status: 'to_do', from_status_label: 'To Do', to_status: 'pending', to_status_label: 'Pending', created_at: '2026-01-01T10:00:00Z' },
                        { id: 'l2', task_id: 't1', actor_id: 'jane.roe', actor_name: 'Jane Roe', from_status: 'pending', from_status_label: 'Pending', to_status: 'in_progress', to_status_label: 'In Progress', created_at: '2026-01-01T11:00:00Z' },
                    ],
                    message: 'ok',
                }),
            ),
        );
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={client}>
                <AuditLogModal taskId="t1" onClose={() => undefined} />
            </QueryClientProvider>,
        );

        const dialog = await screen.findByRole('dialog');
        expect(await within(dialog).findByText(/John Doe/)).toBeInTheDocument();
        // the older John Doe entry renders before the newer Jane Roe entry (chronological)
        const text = dialog.textContent ?? '';
        expect(text.indexOf('John Doe')).toBeLessThan(text.indexOf('Jane Roe'));
        // read-only: no edit/delete controls
        expect(within(dialog).queryByRole('button', { name: /edit|delete/i })).toBeNull();
    });
});
