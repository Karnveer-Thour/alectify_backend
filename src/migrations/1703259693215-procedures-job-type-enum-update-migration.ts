import { MigrationInterface, QueryRunner } from 'typeorm';

export class proceduresJobTypeEnumUpdateMigration1703259693215
  implements MigrationInterface
{
  name = 'proceduresJobTypeEnumUpdateMigration1703259693215';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."procedures_job_type_enum" RENAME TO "procedures_job_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_job_type_enum" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Method of Procedure')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ALTER COLUMN "job_type" TYPE "public"."procedures_job_type_enum" USING "job_type"::"text"::"public"."procedures_job_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procedures_job_type_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."procedures_library_job_type_enum" RENAME TO "procedures_library_job_type_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_library_job_type_enum" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Method of Procedure')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ALTER COLUMN "job_type" TYPE "public"."procedures_library_job_type_enum" USING "job_type"::"text"::"public"."procedures_library_job_type_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procedures_library_job_type_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_library_job_type_enum_old" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Maintenance Operating Procedure')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures_library" ALTER COLUMN "job_type" TYPE "public"."procedures_library_job_type_enum_old" USING "job_type"::"text"::"public"."procedures_library_job_type_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."procedures_library_job_type_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."procedures_library_job_type_enum_old" RENAME TO "procedures_library_job_type_enum"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."procedures_job_type_enum_old" AS ENUM('Job Plan', 'Standard Operating Procedure', 'Maintenance Operating Procedure')`,
    );
    await queryRunner.query(
      `ALTER TABLE "procedures" ALTER COLUMN "job_type" TYPE "public"."procedures_job_type_enum_old" USING "job_type"::"text"::"public"."procedures_job_type_enum_old"`,
    );
    await queryRunner.query(`DROP TYPE "public"."procedures_job_type_enum"`);

    await queryRunner.query(
      `ALTER TYPE "public"."procedures_job_type_enum_old" RENAME TO "procedures_job_type_enum"`,
    );
  }
}
