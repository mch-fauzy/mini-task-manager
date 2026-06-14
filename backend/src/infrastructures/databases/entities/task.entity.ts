import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base.entity';
import { TaskStatus, TaskStatusConstant } from '../../../modules/task/constants/task-status.constant';

/**
 * A task. `status` is stored as a plain varchar so adding a new
 * status never requires a schema migration, the allowed values and transitions
 * are enforced in the domain layer.
 */
@Entity({ name: 'tasks' })
export class Task extends BaseEntity {
    @Column({ type: 'varchar' })
    title!: string;

    @Column({ type: 'varchar', default: TaskStatusConstant.ToDo })
    status!: TaskStatus;
}
