import { z } from 'zod';
import { TASK_STATUS_VALUES } from '../../constants/task-status.constant';

/**
 * Status-change body. Validates only the shape: the target is a known status and the
 * actor id is present. Whether the transition is legal and the actor exists are domain
 * rules checked in the service. Keys arrive camelCased from the snake_case wire
 * (to_status, actor_id) via the validate middleware.
 */
export const TaskUpdateStatusV1Schema = z.object({
    toStatus: z.enum(TASK_STATUS_VALUES, { error: 'to_status must be a valid status' }),
    actorId: z
        .string({ error: 'actor_id is required' })
        .trim()
        .min(1, { error: 'actor_id must not be empty' })
        .max(255),
});
export type ITaskUpdateStatusV1Request = z.infer<typeof TaskUpdateStatusV1Schema>;
