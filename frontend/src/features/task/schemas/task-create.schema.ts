import { z } from 'zod';

// Mirrors the backend create DTO: a trimmed, non-empty, bounded title.
export const taskCreateSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, { error: 'Title is required' })
        .max(255, { error: 'Title is too long' }),
});
