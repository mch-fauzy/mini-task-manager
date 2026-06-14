import { DataSource, QueryRunner, Repository } from 'typeorm';
import { Task } from '../../../infrastructures/databases/entities/task.entity';
import { IPaginateResult } from '../../../shared/interfaces/paginate.interface';
import { scopedRepository } from '../../../shared/utils/repository.util';
import { TaskStatus } from '../constants/task-status.constant';
import { ITaskListV1Request } from '../dtos/requests/task-list-v1.request';

/** Maps API sort keys to entity property names. */
const SORT_COLUMN_MAP: Record<ITaskListV1Request['sort'], string> = {
    created_at: 'createdAt',
    updated_at: 'updatedAt',
    status: 'status',
    title: 'title',
};

/**
 * Data access for tasks. Soft-deleted rows are excluded automatically by TypeORM
 * (find and QueryBuilder honour the @DeleteDateColumn).
 */
export class TaskV1Repository {
    private readonly repo: Repository<Task>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(Task);
    }

    async create(title: string): Promise<Task> {
        return this.repo.save(this.repo.create({ title }));
    }

    /** Finds a non-deleted task by id. Pass a queryRunner to read inside a transaction. */
    async findById(id: string, queryRunner?: QueryRunner): Promise<Task | null> {
        return scopedRepository(this.repo, queryRunner).findOne({ where: { id } });
    }

    /**
     * Sets a task's status and returns the updated row. The queryRunner is required
     * because this only runs as part of the status-change transaction, alongside the
     * audit insert. The row is re-read so the response carries the fresh updatedAt.
     */
    async updateStatus(id: string, status: TaskStatus, queryRunner: QueryRunner): Promise<Task> {
        const repo = scopedRepository(this.repo, queryRunner);
        await repo.update(id, { status });
        return repo.findOneOrFail({ where: { id } });
    }

    async paginate(query: ITaskListV1Request): Promise<IPaginateResult<Task>> {
        const qb = this.repo.createQueryBuilder('task');
        if (query.search) {
            const escaped = query.search.replace(/[%_\\]/g, '\\$&');
            qb.andWhere("task.title LIKE :s ESCAPE '\\'", { s: `%${escaped}%` });
        }
        qb.orderBy(`task.${SORT_COLUMN_MAP[query.sort]}`, query.order)
            .skip((query.page - 1) * query.perPage)
            .take(query.perPage);
        const [items, total] = await qb.getManyAndCount();
        return { items, total };
    }

    async softDelete(id: string): Promise<void> {
        await this.repo.softDelete(id);
    }
}
