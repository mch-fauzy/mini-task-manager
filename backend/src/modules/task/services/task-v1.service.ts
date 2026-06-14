import { DataSource } from 'typeorm';
import { Task } from '../../../infrastructures/databases/entities/task.entity';
import { ErrorMessageConstant } from '../../../shared/constants/error-message.constant';
import {
    BadRequestException,
    NotFoundException,
} from '../../../shared/exceptions/http.exception';
import { IPaginateResult } from '../../../shared/interfaces/paginate.interface';
import { TransactionUtil } from '../../../shared/utils/transaction.util';
import { findActorById } from '../../actor/utils/actor.util';
import { AuditLogV1Repository } from '../../audit-log/repositories/audit-log-v1.repository';
import { TaskStatus } from '../constants/task-status.constant';
import { ITaskListV1Request } from '../dtos/requests/task-list-v1.request';
import { TaskV1Repository } from '../repositories/task-v1.repository';
import { isValidTransition } from '../utils/task-status.util';

/** Outcome of a status change: the (possibly unchanged) task and whether a write happened. */
interface IUpdateStatusResult {
    task: Task;
    changed: boolean;
}

/**
 * Task business logic and domain validation (status-flow rules, idempotency). Owns the
 * DataSource so the status change and its audit-log insert run in one transaction, and
 * delegates plain reads/writes to the repositories.
 */
export class TaskV1Service {
    constructor(
        private readonly dataSource: DataSource,
        private readonly taskRepository: TaskV1Repository,
        private readonly auditLogRepository: AuditLogV1Repository,
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

    /**
     * Changes a task's status under the domain rules:
     * - unknown actor is rejected up front (400)
     * - setting the current status is an idempotent no-op (no audit row)
     * - only a single forward step is allowed, otherwise 400
     * - an effective change updates the task AND appends one audit row in one
     *   transaction, so status and log can never drift.
     */
    async updateStatus(
        id: string,
        toStatus: TaskStatus,
        actorId: string,
    ): Promise<IUpdateStatusResult> {
        const actor = findActorById(actorId);
        if (!actor) throw new BadRequestException(ErrorMessageConstant.UnknownActor);

        return TransactionUtil.execute(this.dataSource, async (queryRunner) => {
            // Re-read inside the transaction so the rule check uses the authoritative status.
            const task = await this.taskRepository.findById(id, queryRunner);
            if (!task) throw new NotFoundException(ErrorMessageConstant.TaskNotFound);

            if (task.status === toStatus) return { task, changed: false };

            if (!isValidTransition(task.status, toStatus)) {
                throw new BadRequestException(
                    ErrorMessageConstant.InvalidTransition(task.status, toStatus),
                );
            }

            const fromStatus = task.status;
            const updated = await this.taskRepository.updateStatus(id, toStatus, queryRunner);
            await this.auditLogRepository.create(
                { taskId: id, actorId: actor.id, actorName: actor.name, fromStatus, toStatus },
                queryRunner,
            );
            return { task: updated, changed: true };
        });
    }
}
