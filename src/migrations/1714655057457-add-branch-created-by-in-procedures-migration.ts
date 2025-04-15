import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBranchCreatedByInProceduresMigration1714655057457
  implements MigrationInterface
{
  name = 'addBranchCreatedByInProceduresMigration1714655057457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "branch_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD "created_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD CONSTRAINT "FK_60a6e6bf95b486a9f2ec7513182" FOREIGN KEY ("branch_id") REFERENCES "branches"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ADD CONSTRAINT "FK_d511983c15d6d36c2a19bd693ed" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "created_by_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP COLUMN "branch_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP CONSTRAINT "FK_d511983c15d6d36c2a19bd693ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" DROP CONSTRAINT "FK_60a6e6bf95b486a9f2ec7513182"`,
    );
  }
}
