-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'CLASS_REMINDER';

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reminderMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NotificationLog_sessionId_userId_reminderMinutes_key" ON "NotificationLog"("sessionId", "userId", "reminderMinutes");
