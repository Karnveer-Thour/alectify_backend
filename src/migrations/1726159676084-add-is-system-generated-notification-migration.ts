import { MigrationInterface, QueryRunner } from 'typeorm';

export class addIsSystemGeneratedNotificationMigration1726159676084
  implements MigrationInterface
{
  name = 'addIsSystemGeneratedNotificationMigration1726159676084';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD "is_system_generated" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notifications" DROP COLUMN "is_system_generated"`,
    );
  }
}
