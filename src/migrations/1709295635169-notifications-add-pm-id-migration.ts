import { MigrationInterface, QueryRunner } from 'typeorm';

export class notificationsAddPmIdMigration1709295635169
  implements MigrationInterface
{
  name = 'notificationsAddPmIdMigration1709295635169';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "preventive_maintenance_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "FK_36b57e1650bccae9d47e8a20e2b" FOREIGN KEY ("preventive_maintenance_id") REFERENCES "preventive_maintenances"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP CONSTRAINT "FK_36b57e1650bccae9d47e8a20e2b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "preventive_maintenance_id"`,
    );
  }
}
