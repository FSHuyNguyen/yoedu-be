/*
  Warnings:

  - The values [OVERPAID] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('UNPAID', 'PARTIAL', 'PAID');
ALTER TABLE "tuition_invoices" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "tuition_invoices" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
ALTER TABLE "tuition_invoices" ALTER COLUMN "status" SET DEFAULT 'UNPAID';
COMMIT;
