import { MigrationInterface, QueryRunner } from 'typeorm';

export class AllowPresentFaculty1572362002275 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TYPE "public"."absence_type_enum" RENAME TO "absence_type_enum_old"');
    await queryRunner.query('CREATE TYPE "absence_type_enum" AS ENUM(\'SABBATICAL\', \'SABBATICAL_ELIGIBLE\', \'SABBATICAL_INELIGIBLE\', \'TEACHING_RELIEF\', \'RESEARCH_LEAVE\', \'PARENTAL_LEAVE\', \'NO_LONGER_ACTIVE\', \'PRESENT\')');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" TYPE "absence_type_enum" USING "type"::"text"::"absence_type_enum"');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" SET DEFAULT \'PRESENT\'');
    await queryRunner.query('DROP TYPE "absence_type_enum_old"');
    await queryRunner.query('COMMENT ON COLUMN "absence"."type" IS \'The type of absence (i.e: Parental Leave, Research Leave etc.)\'');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" SET DEFAULT \'PRESENT\'');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" DROP DEFAULT');
    await queryRunner.query('COMMENT ON COLUMN "absence"."type" IS \'\'');
    await queryRunner.query('CREATE TYPE "absence_type_enum_old" AS ENUM(\'SABBATICAL\', \'SABBATICAL_ELIGIBLE\', \'SABBATICAL_INELIGIBLE\', \'TEACHING_RELIEF\', \'RESEARCH_LEAVE\', \'PARENTAL_LEAVE\', \'NO_LONGER_ACTIVE\')');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" DROP DEFAULT');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" TYPE "absence_type_enum_old" USING "type"::"text"::"absence_type_enum_old"');
    await queryRunner.query('ALTER TABLE "absence" ALTER COLUMN "type" SET DEFAULT \'PRESENT\'');
    await queryRunner.query('DROP TYPE "absence_type_enum"');
    await queryRunner.query('ALTER TYPE "absence_type_enum_old" RENAME TO  "absence_type_enum"');
  }
}
