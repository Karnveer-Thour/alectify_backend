import { MigrationInterface, QueryRunner } from 'typeorm';

export class manageOrderAddUserMigration1704803262336
  implements MigrationInterface
{
  name = 'manageOrderAddUserMigration1704803262336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD "user_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ADD CONSTRAINT "FK_4acb5a5ef853a19a5d009dbc52c" FOREIGN KEY ("user_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP CONSTRAINT "FK_4acb5a5ef853a19a5d009dbc52c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" DROP COLUMN "user_id"`,
    );
  }
}
