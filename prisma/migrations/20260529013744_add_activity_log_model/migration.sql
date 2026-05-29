-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('STUDENT_CREATED', 'TEACHER_CREATED', 'COURSE_CREATED', 'STUDENT_ENROLLED');

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);
