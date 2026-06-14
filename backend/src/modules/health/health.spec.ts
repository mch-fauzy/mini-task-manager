import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createApp } from '../../app';
import { createTestDataSource } from '../../test/test-data-source';

describe('GET /api/v1/health', () => {
    let app: Express;
    let dataSource: DataSource;

    beforeAll(async () => {
        dataSource = await createTestDataSource();
        app = createApp(dataSource);
    });
    afterAll(async () => {
        await dataSource.destroy();
    });

    it('returns the snake_cased success envelope', async () => {
        const res = await request(app).get('/api/v1/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ data: { status: 'ok' }, message: 'Service is healthy.' });
    });

    it('returns a 404 envelope for unknown routes', async () => {
        const res = await request(app).get('/api/v1/nope');
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Route not found.');
    });
});
