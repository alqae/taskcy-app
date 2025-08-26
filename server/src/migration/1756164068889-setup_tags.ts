import { MigrationInterface, QueryRunner } from "typeorm"

export class SetupTags1756164068889 implements MigrationInterface {
    name = "SetupTags1756164068889"

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "color" character varying NOT NULL, "user_id" integer, CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`)
        await queryRunner.query(`ALTER TABLE "tag" ADD CONSTRAINT "FK_d0be05b78e89aff4791e6189f77" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tag" DROP CONSTRAINT "FK_d0be05b78e89aff4791e6189f77"`)
        await queryRunner.query(`DROP TABLE "tag"`)
    }
}
