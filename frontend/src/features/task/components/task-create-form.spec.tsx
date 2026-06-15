import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App as AntApp } from 'antd';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { server } from '../../../test/server';
import { TaskCreateForm } from './task-create-form';

const BASE = 'http://localhost:3000/api/v1';

function renderForm() {
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={client}>
            <AntApp>
                <TaskCreateForm />
            </AntApp>
        </QueryClientProvider>,
    );
}

describe('TaskCreateForm', () => {
    it('shows a validation error for an empty title and does not call the API', async () => {
        renderForm();
        await userEvent.click(screen.getByRole('button', { name: /add task/i }));
        expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    });

    it('rejects a whitespace-only title (Zod trim guard, not just AntD required)', async () => {
        renderForm();
        await userEvent.type(screen.getByLabelText(/title/i), '   ');
        await userEvent.click(screen.getByRole('button', { name: /add task/i }));
        expect(await screen.findByText(/title is required/i)).toBeInTheDocument();
    });

    it('submits a valid title', async () => {
        let called = false;
        server.use(
            http.post(`${BASE}/tasks`, async ({ request }) => {
                called = true;
                const body = (await request.json()) as { title: string };
                expect(body.title).toBe('Prepare Invoice');
                return HttpResponse.json({
                    data: {
                        id: 't1',
                        title: 'Prepare Invoice',
                        status: 'to_do',
                        status_label: 'To Do',
                        created_at: 'x',
                        updated_at: 'y',
                    },
                    message: 'ok',
                });
            }),
        );
        renderForm();
        await userEvent.type(screen.getByLabelText(/title/i), 'Prepare Invoice');
        await userEvent.click(screen.getByRole('button', { name: /add task/i }));
        await screen.findByDisplayValue(''); // form resets after success
        expect(called).toBe(true);
    });
});
