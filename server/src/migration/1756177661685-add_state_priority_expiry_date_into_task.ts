import { MigrationInterface, QueryRunner } from "typeorm"

export class AddStatePriorityExpiryDateIntoTask1756177661685 implements MigrationInterface {
    name = "AddStatePriorityExpiryDateIntoTask1756177661685"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."task_state_enum" AS ENUM('todo', 'in_progress', 'completed')`)
        await queryRunner.query(`ALTER TABLE "task" ADD "state" "public"."task_state_enum" NOT NULL DEFAULT 'todo'`)
        await queryRunner.query(`ALTER TABLE "task" ADD "expiryDate" date NOT NULL`)
        await queryRunner.query(`CREATE TYPE "public"."task_priority_enum" AS ENUM('low', 'medium', 'high')`)
        await queryRunner.query(`ALTER TABLE "task" ADD "priority" "public"."task_priority_enum" NOT NULL DEFAULT 'low'`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "priority"`)
        await queryRunner.query(`DROP TYPE "public"."task_priority_enum"`)
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "expiryDate"`)
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "state"`)
        await queryRunner.query(`DROP TYPE "public"."task_state_enum"`)
    }
}
