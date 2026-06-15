import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../../../shared/constants/task-status.constant';

/**
 * Append-only record of one effective task status change. Deliberately does NOT
 * extend BaseEntity: there is no updatedAt and no soft delete, and the repository
 * exposes no update/delete methods, so a logged change can never be altered.
 * actorName is denormalized (snapshot at write time) so history still renders the
 * name even if the hardcoded actor list later changes.
 *
 * Append-only is also enforced in the database by triggers (TypeORM cannot declare them
 * on an entity): see ../triggers/audit-log-immutable.trigger.ts.
 */
@Entity({ name: 'audit_logs' })
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Index()
    @Column({ type: 'varchar' })
    taskId!: string;

    @Column({ type: 'varchar' })
    actorId!: string;

    @Column({ type: 'varchar' })
    actorName!: string;

    @Column({ type: 'varchar' })
    fromStatus!: TaskStatus;

    @Column({ type: 'varchar' })
    toStatus!: TaskStatus;

    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;
}
