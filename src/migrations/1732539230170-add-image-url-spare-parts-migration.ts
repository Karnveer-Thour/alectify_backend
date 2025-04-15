import { MigrationInterface, QueryRunner } from 'typeorm';

export class addImageUrlSparePartsMigration1732539230170
  implements MigrationInterface
{
  name = 'addImageUrlSparePartsMigration1732539230170';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spare_parts" ADD "image_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "spare_parts" DROP COLUMN "image_url"`,
    );
  }
}
