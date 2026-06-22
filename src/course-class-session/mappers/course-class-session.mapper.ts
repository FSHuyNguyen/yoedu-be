import { Prisma, SessionStatus } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';
import { mappedWeekday } from '../../schedule/mappers/schedule.mapper';

export const ATTENDANCE_INCLUDE = {
  student: {
    include: {
      user: true,
    },
  },
} satisfies Prisma.AttendanceInclude;

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
      room: true,
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
    ...courseClassSession.courseClass.course,
    courseId: courseClassSession.courseClass.course.id,
    courseName: courseClassSession.courseClass.course.name,

    id: courseClassSession.id,

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

export const mapCourseClassSessionCalendarResponse = (
  session: CourseClassSessionResponse,
) => {
  return {
    id: session.id,

    title: session.courseClass.name,

    start: session.startTime,

    end: session.endTime,

    status: session.status,
    statusText: mappedStatusText[session.status],

    courseClassId: session.courseClassId,

    courseClassName: session.courseClass.name,

    mainTeacherName: session.courseClass.mainTeacher.user.fullName,

    assistantTeacherName:
      session.courseClass.assistantTeacher?.user.fullName ?? '',

    courseName: session.courseClass.course.name,

    roomName: session.courseClass.room.name,

    note: session.note ?? '',
  };
};

export const mapCourseClassSessionAttendanceResponse = (
  session: any,
  students: any,
) => {
  return {
    sessionId: session.id,

    className: session.courseClass.name,

    startTime: session.startTime,
    endTime: session.endTime,

    status: session.status,

    students,
  };
};
