import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDurantionIntoTask1756270149831 implements MigrationInterface {
    name = 'AddDurantionIntoTask1756270149831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" ADD "duration" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "duration"`);
    }

}
