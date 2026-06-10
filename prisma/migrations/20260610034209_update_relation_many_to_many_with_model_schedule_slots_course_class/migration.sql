/*
  Warnings:

  - You are about to drop the column `scheduleSlotId` on the `course_classes` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "course_classes" DROP CONSTRAINT "course_classes_scheduleSlotId_fkey";

-- AlterTable
ALTER TABLE "course_classes" DROP COLUMN "scheduleSlotId";

-- CreateTable
CREATE TABLE "course_class_schedules" (
    "id" TEXT NOT NULL,
    "courseClassId" TEXT NOT NULL,
    "scheduleSlotId" TEXT NOT NULL,

    CONSTRAINT "course_class_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "course_class_schedules_courseClassId_scheduleSlotId_key" ON "course_class_schedules"("courseClassId", "scheduleSlotId");

-- AddForeignKey
ALTER TABLE "course_class_schedules" ADD CONSTRAINT "course_class_schedules_courseClassId_fkey" FOREIGN KEY ("courseClassId") REFERENCES "course_classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_class_schedules" ADD CONSTRAINT "course_class_schedules_scheduleSlotId_fkey" FOREIGN KEY ("scheduleSlotId") REFERENCES "schedule_slots"("id") ON DELETE CASCADE ON UPDATE CASCADE;
