import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationsAddCreatedByMigration1709200533189
  implements MigrationInterface
{
  name = 'notificationsAddCreatedByMigration1709200533189';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "created_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_8abe9303bccd29799a4d435eb03" FOREIGN KEY ("created_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_8abe9303bccd29799a4d435eb03"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "created_by_id"`,
    );
  }
}
