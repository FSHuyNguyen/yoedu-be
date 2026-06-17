-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('SUCCESS', 'CANCELLED');

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "status" "PaymentStatus" NOT NULL DEFAULT 'SUCCESS';
