import { MigrationInterface, QueryRunner } from 'typeorm';

export class removedUnusedEnumsManageOrdersMigration1717165745711
  implements MigrationInterface
{
  name = 'removedUnusedEnumsManageOrdersMigration1717165745711';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_activity_enum" RENAME TO "manage_order_histories_activity_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_activity_enum" AS ENUM('Items Drawn', 'Items Borrow', 'Order Created', 'Order Updated', 'Items Received', 'Items Received & Order Completed')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "activity" TYPE "public"."manage_order_histories_activity_enum" USING "activity"::"text"::"public"."manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_activity_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."manage_order_histories_activity_enum_old" AS ENUM('Items Borrow', 'Items Drawn', 'Items Received', 'Items Received & Order Completed', 'Items received', 'Order Created', 'Order Updated', 'Order completed', 'Order created', 'Order updated')`,
    );
    await queryRunner.query(
      `ALTER TABLE "manage_order_histories" ALTER COLUMN "activity" TYPE "public"."manage_order_histories_activity_enum_old" USING "activity"::"text"::"public"."manage_order_histories_activity_enum_old"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."manage_order_histories_activity_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "public"."manage_order_histories_activity_enum_old" RENAME TO "manage_order_histories_activity_enum"`,
    );
  }
}
