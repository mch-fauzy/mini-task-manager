import { z } from 'zod';

/** Route param schema: a valid UUID task id. */
export const TaskIdParamV1Schema = z.object({ id: z.uuid({ error: 'invalid task id' }) });
export type ITaskIdParamV1Request = z.infer<typeof TaskIdParamV1Schema>;
