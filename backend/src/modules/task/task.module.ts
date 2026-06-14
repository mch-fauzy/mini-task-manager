import { Router } from 'express';
import { DataSource } from 'typeorm';
import { validate } from '../../infrastructures/middlewares/validate.middleware';
import { TaskV1Controller } from './controllers/task-v1.controller';
import { TaskCreateV1Schema } from './dtos/requests/task-create-v1.request';
import { TaskIdParamV1Schema } from './dtos/requests/task-id-param-v1.request';
import { TaskListV1Schema } from './dtos/requests/task-list-v1.request';
import { TaskV1Repository } from './repositories/task-v1.repository';
import { TaskV1Service } from './services/task-v1.service';

/** Builds the task dependencies and returns its Router. */
export function createTaskRouter(dataSource: DataSource): Router {
    const repository = new TaskV1Repository(dataSource);
    const service = new TaskV1Service(dataSource, repository);
    const controller = new TaskV1Controller(service);

    const router = Router();
    router.get('/', validate(TaskListV1Schema, 'query'), controller.list);
    router.post('/', validate(TaskCreateV1Schema, 'body'), controller.create);
    router.delete('/:id', validate(TaskIdParamV1Schema, 'params'), controller.delete);
    return router;
}
