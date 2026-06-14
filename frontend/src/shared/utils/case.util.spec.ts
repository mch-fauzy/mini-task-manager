import { describe, expect, it } from 'vitest';
import { camelCaseKeys, snakeCaseKeys } from './case.util';

describe('case util', () => {
    it('camelCases nested response keys', () => {
        expect(camelCaseKeys({ status_label: 'To Do', meta: { total_pages: 2 } })).toEqual({
            statusLabel: 'To Do',
            meta: { totalPages: 2 },
        });
    });
    it('snakeCases request bodies and arrays', () => {
        expect(snakeCaseKeys({ toStatus: 'done', actorId: 'u1' })).toEqual({ to_status: 'done', actor_id: 'u1' });
        expect(snakeCaseKeys([{ perPage: 10 }])).toEqual([{ per_page: 10 }]);
    });
});
