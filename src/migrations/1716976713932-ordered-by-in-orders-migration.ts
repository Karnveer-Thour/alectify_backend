import { MigrationInterface, QueryRunner } from 'typeorm';

export class orderedByInOrdersMigration1716976713932
  implements MigrationInterface
{
  name = 'orderedByInOrdersMigration1716976713932';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD "ordered_by_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" ADD CONSTRAINT "FK_63577ee6e255de0de7711cb7c79" FOREIGN KEY ("ordered_by_id") REFERENCES "authentication_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP CONSTRAINT "FK_63577ee6e255de0de7711cb7c79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_orders" DROP COLUMN "ordered_by_id"`,
    );
  }
}
