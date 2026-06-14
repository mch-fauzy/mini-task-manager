import { DataSource, QueryRunner } from 'typeorm';

export const TransactionUtil = {
    /**
     * Run `work` inside a single TypeORM transaction. Commits on success, rolls
     * back on any thrown error, and always releases the QueryRunner. Used to keep
     * a task's status update and its audit-log insert atomic (all-or-nothing).
     */
    async execute<T>(
        dataSource: DataSource,
        work: (queryRunner: QueryRunner) => Promise<T>,
    ): Promise<T> {
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const result = await work(queryRunner);
            await queryRunner.commitTransaction();
            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    },
};
