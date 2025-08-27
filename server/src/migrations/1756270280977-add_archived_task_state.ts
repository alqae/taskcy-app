import { MigrationInterface, QueryRunner } from "typeorm";

export class AddArchivedTaskState1756270280977 implements MigrationInterface {
    name = 'AddArchivedTaskState1756270280977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."task_state_enum" RENAME TO "task_state_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."task_state_enum" AS ENUM('todo', 'in_progress', 'completed', 'archived')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" TYPE "public"."task_state_enum" USING "state"::"text"::"public"."task_state_enum"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" SET DEFAULT 'todo'`);
        await queryRunner.query(`DROP TYPE "public"."task_state_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_state_enum_old" AS ENUM('todo', 'in_progress', 'completed')`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" TYPE "public"."task_state_enum_old" USING "state"::"text"::"public"."task_state_enum_old"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "state" SET DEFAULT 'todo'`);
        await queryRunner.query(`DROP TYPE "public"."task_state_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."task_state_enum_old" RENAME TO "task_state_enum"`);
    }

}
