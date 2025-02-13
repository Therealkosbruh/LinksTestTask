import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1739283700098 implements MigrationInterface {
    name = 'Auto1739283700098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "url" ("id" SERIAL NOT NULL, "shortUrl" character varying NOT NULL, "originalUrl" character varying NOT NULL, "expiresAt" TIMESTAMP, "alias" character varying(20), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "clickCount" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_5f81972de6fed8a2e99a818a8b6" UNIQUE ("shortUrl"), CONSTRAINT "UQ_ec67d700c5e068763c1fa0dd30f" UNIQUE ("alias"), CONSTRAINT "PK_7421088122ee64b55556dfc3a91" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "url"`);
    }

}
