import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import { Express } from 'express';
import { DataSource } from 'typeorm';
import { createApp } from '../../app';
import { createTestDataSource } from '../../test/test-data-source';

describe('Actor API', () => {
    let app: Express;
    let dataSource: DataSource;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        app = createApp(dataSource);
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('returns the hardcoded actor list in the snake_case envelope', async () => {
        const res = await request(app).get('/api/v1/actors');

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Actors retrieved successfully.');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThan(0);
        expect(res.body.data[0]).toMatchObject({
            id: expect.any(String),
            name: expect.any(String),
        });
        const ids = res.body.data.map((actor: { id: string }) => actor.id);
        expect(ids).toContain('john.doe');
    });
});
