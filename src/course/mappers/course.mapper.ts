import { Prisma } from '@prisma/client';
import { USER_INCLUDE } from '../../user/constants/user.constants';

export const COURSE_INCLUDE = {
  teacher: {
    include: USER_INCLUDE,
  },
} satisfies Prisma.CourseInclude;

type CourseResponse = Prisma.CourseGetPayload<{
  include: typeof COURSE_INCLUDE;
}>;

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

    startDate: course.startDate,

    endDate: course.endDate,

    status: course.status,

    teacherId: course.teacherId,

    teacherfullName: course.teacher ? course.teacher.user.fullName : '',

    createdAt: course.createdAt,

    updatedAt: course.updatedAt,
  };
};
