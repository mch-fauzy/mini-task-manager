import { describe, it, expect } from 'vitest';
import { snakeCaseKeys, camelCaseKeys } from './string.util';

describe('snakeCaseKeys', () => {
    it('converts nested object keys and array items to snake_case', () => {
        const input = { taskId: '1', auditLog: [{ fromStatus: 'to_do', toStatus: 'pending' }] };
        expect(snakeCaseKeys(input)).toEqual({
            task_id: '1',
            audit_log: [{ from_status: 'to_do', to_status: 'pending' }],
        });
    });
    it('passes Date and null through untouched', () => {
        const d = new Date('2026-01-01T00:00:00Z');
        expect(snakeCaseKeys({ createdAt: d, deletedAt: null })).toEqual({
            created_at: d,
            deleted_at: null,
        });
    });
});

describe('camelCaseKeys', () => {
    it('converts incoming snake_case keys to camelCase', () => {
        expect(camelCaseKeys({ to_status: 'done', actor_id: 'u1' })).toEqual({
            toStatus: 'done',
            actorId: 'u1',
        });
    });
});
