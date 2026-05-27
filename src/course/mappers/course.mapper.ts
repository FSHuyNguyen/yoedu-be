import { CourseStatus, Prisma } from '@prisma/client';
import { USER_INCLUDE } from '../../user/constants/user.constants';

export const COURSE_INCLUDE = {
  teacher: {
    include: USER_INCLUDE,
  },
} satisfies Prisma.CourseInclude;

type CourseResponse = Prisma.CourseGetPayload<{
  include: typeof COURSE_INCLUDE;
}>;

const mappedStatusText: Record<string, string> = {
  [CourseStatus.DRAFT]: 'Bản nháp',
  [CourseStatus.OPEN]: 'Đang mở',
  [CourseStatus.CLOSED]: 'Đã đóng',
  [CourseStatus.DELETED]: 'Đã xóa',
};

export const mapCourseResponse = (course: CourseResponse) => {
  return {
    id: course.id,

    courseCode: course.courseCode,

    name: course.name,

    description: course.description,

    thumbnailUrl: course.thumbnailUrl,

    level: course.level,

    price: course.price,

    totalSessions: course.totalSessions,

    maxStudents: course.maxStudents,

    startDate: course.startDate,

    endDate: course.endDate,

    teacherId: course.teacherId,

    teacherName: course.teacher ? course.teacher.user.fullName : '',

    status: course.status,

    statusText: mappedStatusText[course.status],

    createdAt: course.createdAt,

    updatedAt: course.updatedAt,
  };
};
