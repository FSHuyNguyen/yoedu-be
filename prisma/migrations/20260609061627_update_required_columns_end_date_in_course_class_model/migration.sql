/*
  Warnings:

  - Made the column `endDate` on table `course_classes` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "course_classes" ALTER COLUMN "endDate" SET NOT NULL;
