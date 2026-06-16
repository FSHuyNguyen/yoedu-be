/*
  Warnings:

  - You are about to drop the column `billingMonth` on the `tuition_invoices` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId,courseClassId]` on the table `tuition_invoices` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tuition_invoices_studentId_courseClassId_billingMonth_key";

-- AlterTable
ALTER TABLE "tuition_invoices" DROP COLUMN "billingMonth";

-- CreateIndex
CREATE UNIQUE INDEX "tuition_invoices_studentId_courseClassId_key" ON "tuition_invoices"("studentId", "courseClassId");
