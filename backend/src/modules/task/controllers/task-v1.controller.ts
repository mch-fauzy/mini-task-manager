import { Request, Response } from 'express';
import { SuccessMessageConstant } from '../../../shared/constants/success-message.constant';
import { PaginationUtil } from '../../../shared/utils/pagination.util';
import { ITaskCreateV1Request } from '../dtos/requests/task-create-v1.request';
import { ITaskIdParamV1Request } from '../dtos/requests/task-id-param-v1.request';
import { ITaskListV1Request } from '../dtos/requests/task-list-v1.request';
import { TaskV1Response } from '../dtos/responses/task-v1.response';
import { TaskV1Service } from '../services/task-v1.service';

/**
 * HTTP boundary for tasks: reads validated input, calls one service method, and
 * maps the result into the response envelope. No business logic lives here.
 */
export class TaskV1Controller {
    constructor(private readonly service: TaskV1Service) {}

    create = async (req: Request, res: Response): Promise<void> => {
        const { title } = req.validatedBody as ITaskCreateV1Request;
        const task = await this.service.create(title);
        res.success(TaskV1Response.MapEntity(task), SuccessMessageConstant.TaskCreated, 201);
    };

    list = async (req: Request, res: Response): Promise<void> => {
        const query = req.validatedQuery as ITaskListV1Request;
        const { items, total } = await this.service.list(query);
        const meta = PaginationUtil.buildMeta(total, query.page, query.perPage);
        res.success(TaskV1Response.MapEntities(items), SuccessMessageConstant.TasksRetrieved, 200, meta);
    };

    delete = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.validatedParams as ITaskIdParamV1Request;
        await this.service.delete(id);
        res.success(null, SuccessMessageConstant.TaskDeleted, 200);
    };
}
