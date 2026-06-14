import { z } from 'zod';

/** List-task query: pagination, sorting, and optional title search (all with defaults). */
export const TaskListV1Schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    perPage: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.enum(['created_at', 'updated_at', 'status', 'title']).default('created_at'),
    order: z.enum(['ASC', 'DESC']).default('DESC'),
    search: z.string().trim().min(1).optional(),
});
export type ITaskListV1Request = z.infer<typeof TaskListV1Schema>;
