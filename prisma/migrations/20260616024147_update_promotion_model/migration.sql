/*
  Warnings:

  - The values [SCHEDULED] on the enum `PromotionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PromotionStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'EXPIRED');
ALTER TABLE "promotions" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "promotions" ALTER COLUMN "status" TYPE "PromotionStatus_new" USING ("status"::text::"PromotionStatus_new");
ALTER TYPE "PromotionStatus" RENAME TO "PromotionStatus_old";
ALTER TYPE "PromotionStatus_new" RENAME TO "PromotionStatus";
DROP TYPE "PromotionStatus_old";
ALTER TABLE "promotions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
COMMIT;

-- AlterTable
ALTER TABLE "promotions" ALTER COLUMN "status" SET DEFAULT 'ACTIVE';
