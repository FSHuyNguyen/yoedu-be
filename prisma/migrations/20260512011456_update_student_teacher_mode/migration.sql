/*
  Warnings:

  - A unique constraint covering the columns `[teacherCode]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.
  - Made the column `studentCode` on table `students` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `teacherCode` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ALTER COLUMN "studentCode" SET NOT NULL;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "teacherCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "teachers_teacherCode_key" ON "teachers"("teacherCode");
