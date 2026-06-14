import { z } from 'zod';

/** Create-task body: a non-empty, trimmed title (status always starts at to_do). */
export const TaskCreateV1Schema = z.object({
    title: z
        .string({ error: 'title is required' })
        .trim()
        .min(1, { error: 'title must not be empty' })
        .max(255),
});
export type ITaskCreateV1Request = z.infer<typeof TaskCreateV1Schema>;
