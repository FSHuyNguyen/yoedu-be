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

    totalSessions: course.totalSessions,

    status: course.status,

    statusText: mappedStatusText[course.status],

    createdAt: course.createdAt,
    updatedAt: course.updatedAt,
  };
};
