import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1739283854087 implements MigrationInterface {
    name = 'Auto1739283854087'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "click_analytics" ("id" SERIAL NOT NULL, "ipAddress" character varying NOT NULL, "clickedAt" TIMESTAMP NOT NULL DEFAULT now(), "urlId" integer, CONSTRAINT "PK_ccf76fff88c477b925404aaad82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "click_analytics" ADD CONSTRAINT "FK_a9f76e99f4703031467a782ef0a" FOREIGN KEY ("urlId") REFERENCES "url"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "click_analytics" DROP CONSTRAINT "FK_a9f76e99f4703031467a782ef0a"`);
        await queryRunner.query(`DROP TABLE "click_analytics"`);
    }

}
