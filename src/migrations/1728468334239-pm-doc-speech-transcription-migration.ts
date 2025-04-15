import { MigrationInterface, QueryRunner } from 'typeorm';

export class pmDocSpeechTranscriptionMigration1728468334239
  implements MigrationInterface
{
  name = 'pmDocSpeechTranscriptionMigration1728468334239';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" ADD "speech_transcript" text NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "preventive_maintenance_documents" DROP COLUMN "speech_transcript"`,
    );
  }
}
