/*
  Warnings:

  - You are about to drop the column `status` on the `course_classes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "course_classes" DROP COLUMN "status";

-- DropEnum
DROP TYPE "CourseClassStatus";
