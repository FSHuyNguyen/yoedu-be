import { Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';
import { mapSchedule } from '../../schedule/mappers/schedule.mapper';
import { getCourseClassStatus } from '../utils/course-class-status';
import { CourseClassStatus } from '../enum/course-class-status.enum';

export const COUSE_CLASS_INCLUDE = {
  course: {},
  room: {
    select: {
      name: true,
    },
  },
  schedules: {
    include: {
      scheduleSlot: true,
    },
  },
  mainTeacher: {
    include: BASE_USER_INCLUDE,
  },
  assistantTeacher: {
    include: BASE_USER_INCLUDE,
  },
};

type CourseClassResponse = Prisma.CourseClassGetPayload<{
  include: typeof COUSE_CLASS_INCLUDE;
}>;

export const mappedStatusText = {
  [CourseClassStatus.OPEN]: 'Mở đăng ký',
  [CourseClassStatus.ONGOING]: 'Đang diễn ra',
  [CourseClassStatus.CLOSED]: 'Đã kết thúc',
};

export const mapCourseClassResponse = (courseClass: CourseClassResponse) => {
  const dataStatus = getCourseClassStatus(
    courseClass.startDate,
    courseClass.endDate,
  );

  return {
    ...courseClass.course,
    courseId: courseClass.courseId,
    courseName: courseClass.course.name,

    id: courseClass.id,

    classCode: courseClass.classCode,

    name: courseClass.name,

    roomId: courseClass.roomId,
    roomName: courseClass.room.name,

    scheduleSlotIds: courseClass.schedules.map((item) => item.scheduleSlotId),
    scheduleInformation: courseClass.schedules.map((item) =>
      mapSchedule(item.scheduleSlot),
    ),

    mainTeacherId: courseClass.mainTeacherId,
    mainTeacherName: courseClass.mainTeacher.user.fullName,

    assistantTeacherId: courseClass.assistantTeacherId,
    assistantTeacherName: courseClass.assistantTeacher
      ? courseClass.assistantTeacher.user.fullName
      : '',

    startDate: courseClass.startDate,

    endDate: courseClass.endDate,

    maxStudents: courseClass.maxStudents,

    tuitionFee: courseClass.tuitionFee,

    status: dataStatus,

    statusText: mappedStatusText[dataStatus],

    createdAt: courseClass.createdAt,
    updatedAt: courseClass.updatedAt,
  };
};
