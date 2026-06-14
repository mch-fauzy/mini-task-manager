import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateAuditLogTable1781460403334 implements MigrationInterface {
    name = 'CreateAuditLogTable1781460403334'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "audit_logs" ("id" varchar PRIMARY KEY NOT NULL, "task_id" varchar NOT NULL, "actor_id" varchar NOT NULL, "actor_name" varchar NOT NULL, "from_status" varchar NOT NULL, "to_status" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE INDEX "IDX_cdc15ea4d795d9a65791d91536" ON "audit_logs" ("task_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_cdc15ea4d795d9a65791d91536"`);
        await queryRunner.query(`DROP TABLE "audit_logs"`);
    }

}
