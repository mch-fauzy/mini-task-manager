import { Column, Entity } from 'typeorm';
import { TaskStatus, TaskStatusConstant } from '../../../shared/constants/task-status.constant';
import { BaseEntity } from './base.entity';

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
