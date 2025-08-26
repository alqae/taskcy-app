import { MigrationInterface, QueryRunner } from "typeorm"

export class SetupTasks1756164261142 implements MigrationInterface {
    name = "SetupTasks1756164261142"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "task" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "category_id" integer, "user_id" integer, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`)
        await queryRunner.query(`CREATE TABLE "tasks_tags" ("task_id" integer NOT NULL, "tag_id" integer NOT NULL, CONSTRAINT "PK_22555e9d5dfc37851895f0baffb" PRIMARY KEY ("task_id", "tag_id"))`)
        await queryRunner.query(`CREATE INDEX "IDX_59df4724a06cda41af87120b0a" ON "tasks_tags" ("task_id") `)
        await queryRunner.query(`CREATE INDEX "IDX_3d4e7b193cd9472ca9f5f6aa87" ON "tasks_tags" ("tag_id") `)
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_5a2a57aed53e11558e410ddb44d" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await queryRunner.query(`ALTER TABLE "tasks_tags" ADD CONSTRAINT "FK_59df4724a06cda41af87120b0ab" FOREIGN KEY ("task_id") REFERENCES "task"("id") ON DELETE CASCADE ON UPDATE CASCADE`)
        await queryRunner.query(`ALTER TABLE "tasks_tags" ADD CONSTRAINT "FK_3d4e7b193cd9472ca9f5f6aa87f" FOREIGN KEY ("tag_id") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks_tags" DROP CONSTRAINT "FK_3d4e7b193cd9472ca9f5f6aa87f"`)
        await queryRunner.query(`ALTER TABLE "tasks_tags" DROP CONSTRAINT "FK_59df4724a06cda41af87120b0ab"`)
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_6ea2c1c13f01b7a383ebbeaebb0"`)
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_5a2a57aed53e11558e410ddb44d"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_3d4e7b193cd9472ca9f5f6aa87"`)
        await queryRunner.query(`DROP INDEX "public"."IDX_59df4724a06cda41af87120b0a"`)
        await queryRunner.query(`DROP TABLE "tasks_tags"`)
        await queryRunner.query(`DROP TABLE "task"`)
    }
}
