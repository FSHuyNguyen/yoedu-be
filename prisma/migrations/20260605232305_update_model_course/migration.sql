/*
  Warnings:

  - You are about to drop the column `teacherId` on the `courses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_teacherId_fkey";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "teacherId";
