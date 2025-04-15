import { MigrationInterface, QueryRunner } from 'typeorm';

export class updatePmDeniedCommentsMigration1738674504665
  implements MigrationInterface
{
  name = 'updatePmDeniedCommentsMigration1738674504665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "denied_comment"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "denied_comment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_185463fd9212c2136462f0642da" FOREIGN KEY ("denied_comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_185463fd9212c2136462f0642da"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "denied_comment_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "denied_comment" text`,
    );
  }
}
