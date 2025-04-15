import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmAddReviewCommentIdMigration1722285590043
  implements MigrationInterface
{
  name = 'pmAddReviewCommentId1722285590043';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD "review_comment_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" ADD CONSTRAINT "FK_a169d24a344aebe3fae4c75764d" FOREIGN KEY ("review_comment_id") REFERENCES "comments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP CONSTRAINT "FK_a169d24a344aebe3fae4c75764d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenances" DROP COLUMN "review_comment_id"`,
    );
  }
}
