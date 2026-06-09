/*
  Warnings:

  - The values [FULL] on the enum `CourseClassStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CourseClassStatus_new" AS ENUM ('OPEN', 'ONGOING', 'CLOSED');
ALTER TABLE "course_classes" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "course_classes" ALTER COLUMN "status" TYPE "CourseClassStatus_new" USING ("status"::text::"CourseClassStatus_new");
ALTER TYPE "CourseClassStatus" RENAME TO "CourseClassStatus_old";
ALTER TYPE "CourseClassStatus_new" RENAME TO "CourseClassStatus";
DROP TYPE "CourseClassStatus_old";
ALTER TABLE "course_classes" ALTER COLUMN "status" SET DEFAULT 'OPEN';
COMMIT;
