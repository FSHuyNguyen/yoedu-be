/*
  Warnings:

  - A unique constraint covering the columns `[courseClassId,scheduleSlotId,startTime]` on the table `course_class_sessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "course_class_sessions_courseClassId_scheduleSlotId_startTim_key" ON "course_class_sessions"("courseClassId", "scheduleSlotId", "startTime");
