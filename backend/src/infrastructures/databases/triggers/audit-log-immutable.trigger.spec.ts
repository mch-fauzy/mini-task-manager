import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DataSource } from 'typeorm';
import { createTestDataSource } from '../../../test/test-data-source';

/** Seed one audit row with raw SQL: this tests the database, not the module repository. */
const insertLog = (id: string, taskId: string): string =>
    `INSERT INTO audit_logs (id, task_id, actor_id, actor_name, from_status, to_status)
     VALUES ('${id}', '${taskId}', 'john.doe', 'John Doe', 'to_do', 'pending')`;

describe('audit_logs append-only database triggers', () => {
    let dataSource: DataSource;

    beforeEach(async () => {
        dataSource = await createTestDataSource();
        await dataSource.query(insertLog('log-1', 'task-1'));
    });
    afterEach(async () => {
        await dataSource.destroy();
    });

    it('rejects a direct UPDATE on audit_logs', async () => {
        await expect(dataSource.query(`UPDATE audit_logs SET to_status = 'done'`)).rejects.toThrow(
            /append-only/,
        );
    });

    it('rejects a direct DELETE on audit_logs', async () => {
        await expect(dataSource.query(`DELETE FROM audit_logs`)).rejects.toThrow(/append-only/);
    });

    it('still allows appending a new row', async () => {
        await expect(dataSource.query(insertLog('log-2', 'task-2'))).resolves.not.toThrow();

        const rows = await dataSource.query(`SELECT COUNT(*) AS count FROM audit_logs`);
        expect(Number(rows[0].count)).toBe(2);
    });
});
