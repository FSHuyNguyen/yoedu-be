/*
  Warnings:

  - You are about to drop the column `attendanceDate` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `courseClassId` on the `attendances` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionId,studentId]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionId` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('SCHEDULED', 'DONE', 'CANCELLED', 'RESCHEDULED');

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_courseClassId_fkey";

-- DropIndex
DROP INDEX "attendances_courseClassId_studentId_attendanceDate_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "attendanceDate",
DROP COLUMN "courseClassId",
ADD COLUMN     "sessionId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "course_class_sessions" (
    "id" TEXT NOT NULL,
    "courseClassId" TEXT NOT NULL,
    "scheduleSlotId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'SCHEDULED',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_class_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "attendances_sessionId_studentId_key" ON "attendances"("sessionId", "studentId");

-- AddForeignKey
ALTER TABLE "course_class_sessions" ADD CONSTRAINT "course_class_sessions_courseClassId_fkey" FOREIGN KEY ("courseClassId") REFERENCES "course_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class_sessions" ADD CONSTRAINT "course_class_sessions_scheduleSlotId_fkey" FOREIGN KEY ("scheduleSlotId") REFERENCES "schedule_slots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "course_class_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
