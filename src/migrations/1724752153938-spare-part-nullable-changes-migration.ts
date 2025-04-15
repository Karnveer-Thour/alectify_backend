import { MigrationInterface, QueryRunner } from 'typeorm';

export class sparePartNullableChangesMigration1724752153938
  implements MigrationInterface
{
  name = 'sparePartNullableChangesMigration1724752153938';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE project_spare_parts
          ALTER COLUMN project_part_category_id DROP NOT NULL;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          ALTER TABLE project_spare_parts
          ALTER COLUMN project_part_category_id SET NOT NULL;
      `);
  }
}
