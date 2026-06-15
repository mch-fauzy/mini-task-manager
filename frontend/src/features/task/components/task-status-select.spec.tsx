import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntApp } from 'antd';
import { http, HttpResponse } from 'msw';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../../test/server';
import { ITask } from '../types/task.types';
import { TaskStatusSelect } from './task-status-select';

const BASE = 'http://localhost:3000/api/v1';
const task: ITask = { id: 't1', title: 'A', status: 'to_do', statusLabel: 'To Do', createdAt: 'x', updatedAt: 'y' };

function renderSelect(target: ITask = task) {
    server.use(
        http.get(`${BASE}/actors`, () => HttpResponse.json({ data: [{ id: 'john.doe', name: 'John Doe' }], message: 'ok' })),
    );
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <AntApp>
                <TaskStatusSelect task={target} onDone={() => undefined} />
            </AntApp>
        </QueryClientProvider>,
    );
}

describe('TaskStatusSelect', () => {
    it('preselects the only legal next status and renders the confirm button', async () => {
        renderSelect();
        expect(await screen.findByText('Pending')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /update status/i })).toBeInTheDocument();
    });

    it('shows the final-status notice when the task is already done', async () => {
        renderSelect({ ...task, status: 'done', statusLabel: 'Done' });
        expect(await screen.findByText(/already at the final status/i)).toBeInTheDocument();
    });

    it('blocks submit and shows an inline error when no actor is selected', async () => {
        let called = false;
        server.use(
            http.put(`${BASE}/tasks/t1/status`, () => {
                called = true;
                return HttpResponse.json({ data: {}, message: 'ok' });
            }),
        );
        renderSelect();
        await screen.findByText('Pending'); // component ready (next status preselected)
        await userEvent.click(screen.getByRole('button', { name: /update status/i }));
        expect(await screen.findByText(/please select an actor/i)).toBeInTheDocument();
        expect(called).toBe(false); // no request fired without an actor
    });

    it('submits the next status with the chosen actor and calls onDone', async () => {
        let body: unknown;
        server.use(
            http.get(`${BASE}/actors`, () =>
                HttpResponse.json({ data: [{ id: 'john.doe', name: 'John Doe' }], message: 'ok' }),
            ),
            http.put(`${BASE}/tasks/t1/status`, async ({ request }) => {
                body = await request.json();
                return HttpResponse.json({
                    data: { id: 't1', title: 'A', status: 'pending', status_label: 'Pending', created_at: 'x', updated_at: 'y' },
                    message: 'ok',
                });
            }),
        );
        const onDone = vi.fn();
        const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
        render(
            <QueryClientProvider client={client}>
                <AntApp>
                    <TaskStatusSelect task={task} onDone={onDone} />
                </AntApp>
            </QueryClientProvider>,
        );

        await userEvent.click(screen.getByRole('combobox', { name: /actor/i }));
        await userEvent.click(await screen.findByText('John Doe'));
        await userEvent.click(screen.getByRole('button', { name: /update status/i }));

        await waitFor(() => expect(onDone).toHaveBeenCalled());
        expect(body).toEqual({ to_status: 'pending', actor_id: 'john.doe' }); // api-client snake_cases the body
    });
});
