import { describe, it, expect } from 'vitest';
import { PaginationUtil } from './pagination.util';

describe('PaginationUtil.buildMeta', () => {
    it('computes total_pages via ceil', () => {
        expect(PaginationUtil.buildMeta(23, 2, 10)).toEqual({
            total: 23,
            page: 2,
            perPage: 10,
            totalPages: 3,
        });
    });
    it('returns totalPages 0 when empty', () => {
        expect(PaginationUtil.buildMeta(0, 1, 10).totalPages).toBe(0);
    });
});
