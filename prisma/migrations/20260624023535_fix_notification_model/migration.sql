/*
  Warnings:

  - You are about to drop the column `recipientRefId` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `recipientType` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `studentId` on the `notifications` table. All the data in the column will be lost.
  - Added the required column `userId` to the `notifications` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_studentId_fkey";

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "recipientRefId",
DROP COLUMN "recipientType",
DROP COLUMN "studentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_idx" ON "notifications"("userId", "isRead");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
