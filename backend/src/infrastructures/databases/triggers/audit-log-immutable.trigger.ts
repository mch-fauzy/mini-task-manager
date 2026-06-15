/**
 * Database-level guard that makes the audit_logs table append-only. The app already exposes
 * no update or delete path, but SQLite has no per-table permissions, so a direct SQL client
 * could still change rows. These BEFORE triggers reject any UPDATE or DELETE at the database,
 * giving the audit log a second line of defense beyond the application layer.
 */

/** Runner accepted by the apply helper: both DataSource and QueryRunner expose query(). */
interface ISqlRunner {
    query(sql: string): Promise<unknown>;
}

const TRIGGERS_UP: readonly string[] = [
    `CREATE TRIGGER IF NOT EXISTS audit_logs_block_update
     BEFORE UPDATE ON audit_logs
     BEGIN
         SELECT RAISE(ABORT, 'audit_logs is append-only: update is not allowed');
     END`,
    `CREATE TRIGGER IF NOT EXISTS audit_logs_block_delete
     BEFORE DELETE ON audit_logs
     BEGIN
         SELECT RAISE(ABORT, 'audit_logs is append-only: delete is not allowed');
     END`,
];

/** Statements to remove the triggers. Used by the migration's down(). */
export const AUDIT_LOG_IMMUTABLE_TRIGGERS_DOWN: readonly string[] = [
    `DROP TRIGGER IF EXISTS audit_logs_block_update`,
    `DROP TRIGGER IF EXISTS audit_logs_block_delete`,
];

/** Create the append-only triggers. Called by the migration and the test DataSource. */
export async function applyAuditLogImmutableTriggers(runner: ISqlRunner): Promise<void> {
    for (const sql of TRIGGERS_UP) {
        await runner.query(sql);
    }
}
