import { describe, expect, it } from 'vitest';
import { TaskStatusConstant } from '../../../shared/constants/task-status.constant';
import { isValidTransition } from './task-status.util';

describe('task-status state machine', () => {
    describe('isValidTransition', () => {
        it('accepts each forward single step', () => {
            expect(isValidTransition(TaskStatusConstant.ToDo, TaskStatusConstant.Pending)).toBe(true);
            expect(isValidTransition(TaskStatusConstant.Pending, TaskStatusConstant.InProgress)).toBe(true);
            expect(isValidTransition(TaskStatusConstant.InProgress, TaskStatusConstant.Done)).toBe(true);
        });

        it('rejects skipping a step', () => {
            expect(isValidTransition(TaskStatusConstant.ToDo, TaskStatusConstant.InProgress)).toBe(false);
            expect(isValidTransition(TaskStatusConstant.ToDo, TaskStatusConstant.Done)).toBe(false);
            expect(isValidTransition(TaskStatusConstant.Pending, TaskStatusConstant.Done)).toBe(false);
        });

        it('rejects backward moves', () => {
            expect(isValidTransition(TaskStatusConstant.Done, TaskStatusConstant.InProgress)).toBe(false);
            expect(isValidTransition(TaskStatusConstant.InProgress, TaskStatusConstant.Pending)).toBe(false);
            expect(isValidTransition(TaskStatusConstant.Pending, TaskStatusConstant.ToDo)).toBe(false);
        });

        it('rejects a same-status no-op (idempotency is handled separately, not as a transition)', () => {
            expect(isValidTransition(TaskStatusConstant.ToDo, TaskStatusConstant.ToDo)).toBe(false);
            expect(isValidTransition(TaskStatusConstant.Done, TaskStatusConstant.Done)).toBe(false);
        });
    });
});
