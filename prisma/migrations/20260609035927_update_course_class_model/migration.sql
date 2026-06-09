-- AlterTable
ALTER TABLE "course_classes" ALTER COLUMN "maxStudents" DROP NOT NULL,
ALTER COLUMN "maxStudents" DROP DEFAULT;

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "capacity" DROP DEFAULT;
