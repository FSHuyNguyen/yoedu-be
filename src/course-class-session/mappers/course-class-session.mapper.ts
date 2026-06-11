import { Prisma, SessionStatus } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';
import { mappedWeekday } from '../../schedule/mappers/schedule.mapper';

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

    courseClassId: courseClassSession.courseClass.id,
    courseClassName: courseClassSession.courseClass.name,

    scheduleSlotId: courseClassSession.scheduleSlotId,
    scheduleSlotName: mappedWeekday[courseClassSession.scheduleSlot.weekday],

    mainTeacherId: courseClassSession.courseClass.mainTeacherId,
    mainTeacherName: courseClassSession.courseClass.mainTeacher.user.fullName,

    assistantTeacherId: courseClassSession.courseClass.assistantTeacherId,
    assistantTeacherName: courseClassSession.courseClass.assistantTeacher
      ? courseClassSession.courseClass.assistantTeacher.user.fullName
      : '',

    startTime: courseClassSession.startTime,

    endTime: courseClassSession.endTime,

    note: courseClassSession.note,

    status: courseClassSession.status,

    statusText: mappedStatusText[courseClassSession.status],

    createdAt: courseClassSession.createdAt,
    updatedAt: courseClassSession.updatedAt,
  };
};
