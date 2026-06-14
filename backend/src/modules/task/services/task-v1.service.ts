import { DataSource } from 'typeorm';
import { Task } from '../../../infrastructures/databases/entities/task.entity';
import { ErrorMessageConstant } from '../../../shared/constants/error-message.constant';
import { NotFoundException } from '../../../shared/exceptions/http.exception';
import { IPaginateResult } from '../../../shared/interfaces/paginate.interface';
import { ITaskListV1Request } from '../dtos/requests/task-list-v1.request';
import { TaskV1Repository } from '../repositories/task-v1.repository';

/**
 * Task business logic. Holds the DataSource for transactional flows (status
 * change, added later) and delegates plain reads/writes to the repository.
 */
export class TaskV1Service {
    constructor(
        private readonly taskRepository: TaskV1Repository,
    ) {}

    async create(title: string): Promise<Task> {
        return this.taskRepository.create(title);
    }

    async list(query: ITaskListV1Request): Promise<IPaginateResult<Task>> {
        return this.taskRepository.paginate(query);
    }

    async delete(id: string): Promise<void> {
        const task = await this.taskRepository.findById(id);
        if (!task) throw new NotFoundException(ErrorMessageConstant.TaskNotFound);
        await this.taskRepository.softDelete(id);
    }
}
