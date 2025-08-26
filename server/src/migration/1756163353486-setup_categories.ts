import { MigrationInterface, QueryRunner } from "typeorm"

export class SetupCategories1756163353486 implements MigrationInterface {
    name = "SetupCategories1756163353486"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL,"name" character varying NOT NULL,"description" character varying NOT NULL,"color" character varying NOT NULL,"user_id" integer,CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`)
        await queryRunner.query(`ALTER TABLE "category" ADD CONSTRAINT "FK_6562e564389d0600e6e243d9604" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "category" DROP CONSTRAINT "FK_6562e564389d0600e6e243d9604"`)
        await queryRunner.query(`DROP TABLE "category"`)
    }
}
