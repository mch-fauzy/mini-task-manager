import { describe, expect, it } from 'vitest';
import { buildStatusOptions, getNextStatus } from './task-status.util';

describe('task status util (UX mirror of backend)', () => {
    it('getNextStatus returns the immediate next or null', () => {
        expect(getNextStatus('to_do')).toBe('pending');
        expect(getNextStatus('done')).toBeNull();
    });
    it('buildStatusOptions disables every option except the immediate next', () => {
        const options = buildStatusOptions('to_do');
        const byValue = Object.fromEntries(options.map((o) => [o.value, o.disabled]));
        expect(byValue).toEqual({ to_do: true, pending: false, in_progress: true, done: true });
    });
    it('buildStatusOptions disables all when status is done', () => {
        expect(buildStatusOptions('done').every((o) => o.disabled)).toBe(true);
    });
});
