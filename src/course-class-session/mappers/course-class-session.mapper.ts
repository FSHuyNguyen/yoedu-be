import { Prisma, SessionStatus } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

export const COURSE_CLASS_SESSION_INCLUDE = {
  courseClass: {
    include: {
      course: true,
      mainTeacher: {
        include: BASE_USER_INCLUDE,
      },
      assistantTeacher: {
        include: BASE_USER_INCLUDE,
      },
    },
  },
  scheduleSlot: true,
};

export type CourseClassSessionResponse = Prisma.CourseClassSessionGetPayload<{
  include: typeof COURSE_CLASS_SESSION_INCLUDE;
}>;

export const mappedStatusText = {
  [SessionStatus.SCHEDULED]: 'Đã lên lịch',
  [SessionStatus.DONE]: 'Đã diễn ra',
  [SessionStatus.CANCELLED]: 'Đã hủy',
  [SessionStatus.RESCHEDULED]: 'Đã dời lịch',
};

export const mapCourseClassSessionResponse = (
  courseClassSession: CourseClassSessionResponse,
) => {
  return {
    id: courseClassSession.id,

    courseId: courseClassSession.courseClass.course.id,
    courseName: courseClassSession.courseClass.course.name,

    mainTeacherId: courseClassSession.courseClass.mainTeacherId,
    mainTeacherName: courseClassSession.courseClass.mainTeacher.user.fullName,

    assistantTeacherId: courseClassSession.courseClass.assistantTeacherId,
    assistantTeacherName: courseClassSession.courseClass.assistantTeacher
      ? courseClassSession.courseClass.assistantTeacher.user.fullName
      : '',

    startTime: courseClassSession.startTime,

    endTime: courseClassSession.endTime,

    status: courseClassSession.status,

    statusText: mappedStatusText[courseClassSession.status],

    createdAt: courseClassSession.createdAt,
    updatedAt: courseClassSession.updatedAt,
  };
};
