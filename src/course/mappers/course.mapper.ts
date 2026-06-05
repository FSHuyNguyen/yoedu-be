import { CourseStatus, Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

export const COURSE_INCLUDE = {
  teacher: {
    include: BASE_USER_INCLUDE,
  },
} satisfies Prisma.CourseInclude;

type CourseResponse = Prisma.CourseGetPayload<{
  include: typeof COURSE_INCLUDE;
}>;

const mappedStatusText: Record<CourseStatus, string> = {
  DRAFT: 'Bản nháp',
  OPEN: 'Đang mở',
  CLOSED: 'Đã đóng',
  DELETED: 'Đã xóa',
};

export const mapCourseResponse = (course: CourseResponse) => {
  return {
    id: course.id,

    courseCode: course.courseCode,

    name: course.name,

    description: course.description,

    thumbnailUrl: course.thumbnailUrl,

    level: course.level,

    tuitionFee: course.tuitionFee,

    totalSessions: course.totalSessions,

    maxStudents: course.maxStudents,

    teacherId: course.teacherId,

    teacherCode: course.teacher?.teacherCode ?? null,

    teacherName: course.teacher?.user?.fullName ?? null,

    status: course.status,

    statusText: mappedStatusText[course.status],

    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};
