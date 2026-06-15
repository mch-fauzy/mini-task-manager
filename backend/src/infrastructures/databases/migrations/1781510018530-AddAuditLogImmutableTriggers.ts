import { MigrationInterface, QueryRunner } from "typeorm";
import { applyAuditLogImmutableTriggers, AUDIT_LOG_IMMUTABLE_TRIGGERS_DOWN } from "../triggers/audit-log-immutable.trigger";

export class AddAuditLogImmutableTriggers1781510018530 implements MigrationInterface {
    name = 'AddAuditLogImmutableTriggers1781510018530'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await applyAuditLogImmutableTriggers(queryRunner);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const sql of AUDIT_LOG_IMMUTABLE_TRIGGERS_DOWN) {
            await queryRunner.query(sql);
        }
    }

}
