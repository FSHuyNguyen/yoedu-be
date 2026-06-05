import { CourseStatus, Course } from '@prisma/client';

const mappedStatusText: Record<CourseStatus, string> = {
  DRAFT: 'Bản nháp',
  OPEN: 'Đang mở',
  CLOSED: 'Đã đóng',
  DELETED: 'Đã xóa',
};

export const mapCourseResponse = (course: Course) => {
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

    status: course.status,

    statusText: mappedStatusText[course.status],

    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};
