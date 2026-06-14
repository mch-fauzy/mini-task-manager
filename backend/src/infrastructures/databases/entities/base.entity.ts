import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

/**
 * Shared columns for mutable entities: UUID primary key, create/update
 * timestamps, and a nullable soft-delete timestamp. Column types are explicit
 * so the schema does not depend on reflected metadata.
 */
export abstract class BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @CreateDateColumn({ type: 'datetime' })
    createdAt!: Date;

    @UpdateDateColumn({ type: 'datetime' })
    updatedAt!: Date;

    @DeleteDateColumn({ type: 'datetime', nullable: true })
    deletedAt?: Date | null;
}
