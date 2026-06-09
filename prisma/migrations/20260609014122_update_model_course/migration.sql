/*
  Warnings:

  - You are about to drop the column `maxStudents` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `tuitionFee` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "maxStudents",
DROP COLUMN "tuitionFee";
