import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTaskTable1781449273017 implements MigrationInterface {
    name = 'InitTaskTable1781449273017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tasks" ("id" varchar PRIMARY KEY NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')), "deleted_at" datetime, "title" varchar NOT NULL, "status" varchar NOT NULL DEFAULT ('to_do'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tasks"`);
    }

}
