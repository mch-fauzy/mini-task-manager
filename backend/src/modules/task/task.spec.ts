import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createApp } from '../../app';
import { createTestDataSource } from '../../test/test-data-source';

describe('Task CRUD API', () => {
    let app: Express;
    let dataSource: DataSource;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        app = createApp(dataSource);
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('applies helmet security headers', async () => {
        const res = await request(app).get('/api/v1/tasks');
        expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('creates a task at to_do with snake_case envelope', async () => {
        const res = await request(app).post('/api/v1/tasks').send({ title: 'Prepare Invoice' });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Task created successfully.');
        expect(res.body.data).toMatchObject({
            title: 'Prepare Invoice',
            status: 'to_do',
            status_label: 'To Do',
        });
        expect(res.body.data.id).toBeDefined();
    });

    it('rejects an empty title with 400 validation errors', async () => {
        const res = await request(app).post('/api/v1/tasks').send({ title: '   ' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation Error');
        expect(res.body.errors.title).toBeDefined();
    });

    it('lists with pagination meta and excludes soft-deleted', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        await request(app).post('/api/v1/tasks').send({ title: 'B' });
        await request(app).delete(`/api/v1/tasks/${created.body.data.id}`).expect(200);

        const res = await request(app).get('/api/v1/tasks?page=1&per_page=10&sort=created_at&order=ASC');
        expect(res.status).toBe(200);
        expect(res.body.meta).toMatchObject({ total: 1, page: 1, per_page: 10, total_pages: 1 });
        expect(res.body.data.map((t: { title: string }) => t.title)).toEqual(['B']);
    });

    it('filters the list by a title search query', async () => {
        await request(app).post('/api/v1/tasks').send({ title: 'Prepare Invoice' });
        await request(app).post('/api/v1/tasks').send({ title: 'Send Report' });

        const res = await request(app).get('/api/v1/tasks?page=1&per_page=10&sort=created_at&order=ASC&search=invoice');
        expect(res.status).toBe(200);
        expect(res.body.meta.total).toBe(1);
        expect(res.body.data.map((t: { title: string }) => t.title)).toEqual(['Prepare Invoice']);
    });

    it('advances a task status from a snake_case body and returns the updated task', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'pending', actor_id: 'john.doe' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Task status updated successfully.');
        expect(res.body.data).toMatchObject({ status: 'pending', status_label: 'Pending' });
    });

    it('treats setting the current status as an idempotent no-op', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'to_do', actor_id: 'john.doe' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Task status unchanged.');
        expect(res.body.data.status).toBe('to_do');
    });

    it('rejects an out-of-order status change with 400', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'done', actor_id: 'john.doe' });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Invalid status transition');
    });

    it('rejects an unknown actor with 400', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'pending', actor_id: 'ghost' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Unknown actor.');
    });

    it('rejects an unknown to_status value with 400 validation errors', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'archived', actor_id: 'john.doe' });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation Error');
    });

    it('rejects an over-long actor_id with 400 validation errors', async () => {
        const created = await request(app).post('/api/v1/tasks').send({ title: 'A' });
        const id = created.body.data.id;

        const res = await request(app)
            .put(`/api/v1/tasks/${id}/status`)
            .send({ to_status: 'pending', actor_id: 'x'.repeat(256) });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('Validation Error');
    });

    it('returns 404 when updating the status of a missing task', async () => {
        const res = await request(app)
            .put('/api/v1/tasks/00000000-0000-0000-0000-000000000000/status')
            .send({ to_status: 'pending', actor_id: 'john.doe' });

        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Task not found.');
    });

    it('returns 404 when deleting a missing task', async () => {
        const res = await request(app).delete('/api/v1/tasks/00000000-0000-0000-0000-000000000000');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Task not found.');
    });
});
