-- AlterTable
ALTER TABLE "check_ins" ALTER COLUMN "validated_at" DROP NOT NULL,
ALTER COLUMN "validated_at" DROP DEFAULT;
