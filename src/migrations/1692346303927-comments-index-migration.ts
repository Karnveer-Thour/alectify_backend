import { MigrationInterface, QueryRunner } from 'typeorm';

export class commentsIndexMigration1692346303927 implements MigrationInterface {
  name = 'commentsIndexMigration1692346303927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "comments_sent_by_id_e11fa718_fk_authentication_user_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "comments_project_id_703f8155_fk_projects_id"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."comments_project_898184_idx"`,
    );
    await queryRunner.query(
      `CREATE INDEX "comments_project_898184_idx" ON "comments" ("project_id", "reference_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_03dbde2ff570596e874bb3bb311" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_49892741ad64371a6708067d6fa" FOREIGN KEY ("sent_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_49892741ad64371a6708067d6fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_03dbde2ff570596e874bb3bb311"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."comments_project_898184_idx"`,
    );
    await queryRunner.query(
      `CREATE INDEX "comments_project_898184_idx" ON "comments" ("reference_id", "project_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "comments_project_id_703f8155_fk_projects_id" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "comments_sent_by_id_e11fa718_fk_authentication_user_id" FOREIGN KEY ("sent_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`,
    );
  }
}
