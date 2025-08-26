import { MigrationInterface, QueryRunner } from "typeorm";

export class SetupUsers1756159658721 implements MigrationInterface {
    name = 'SetupUsers1756159658721'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "password" text NOT NULL, "tokenVersion" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_44f3f202d142a2c450b6922b560" UNIQUE ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_44f3f202d142a2c450b6922b560"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
