import { MigrationInterface, QueryRunner } from "typeorm"

export class MakeUniqueNamesCategoryAndTag1756165268344 implements MigrationInterface {
    name = "MakeUniqueNamesCategoryAndTag1756165268344"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name")`)
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "UQ_23c05c292c439d77b0de816b500" UNIQUE ("name")`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "UQ_23c05c292c439d77b0de816b500"`)
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b"`)
    }
}
