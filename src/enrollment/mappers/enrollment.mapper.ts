import { EnrollmentStatus, Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';
import { mapSchedule } from '../../schedule/mappers/schedule.mapper';

export const ENROLLMENT_INCLUDE = {
  student: {
    include: BASE_USER_INCLUDE,
  },
  courseClass: {
    include: {
      course: true,
      schedules: {
        include: {
          scheduleSlot: true,
        },
      },
    },
  },
} satisfies Prisma.EnrollmentInclude;

export type EnrollmentResponse = Prisma.EnrollmentGetPayload<{
  include: typeof ENROLLMENT_INCLUDE;
}>;

const mappedStatusText: Record<string, string> = {
  [EnrollmentStatus.ACTIVE]: 'Đang học',
  [EnrollmentStatus.PAUSED]: 'Bảo lưu',
  [EnrollmentStatus.DROPPED]: 'Đã thôi học',
  [EnrollmentStatus.COMPLETED]: 'Hoàn thành',
  [EnrollmentStatus.CANCELLED]: 'Hủy đăng ký',
};

export const mapEnrollmentResponse = (enrollment: EnrollmentResponse) => {
  return {
    ...enrollment.courseClass,

    courseClassId: enrollment.courseClass.id,
    courseClassName: enrollment.courseClass.name,

    scheduleSlotIds: enrollment.courseClass.schedules.map(
      (item) => item.scheduleSlotId,
    ),
    scheduleInformation: enrollment.courseClass.schedules.map((item) =>
      mapSchedule(item.scheduleSlot),
    ),

    courseId: enrollment.courseClass.course.id,
    courseName: enrollment.courseClass.course.name,

    id: enrollment.id,

    studentId: enrollment.studentId,
    studentName: enrollment.student.user.fullName,

    status: enrollment.status,
    statusText: mappedStatusText[enrollment.status],

    note: enrollment.note,

    enrolledAt: enrollment.enrolledAt,

    createdAt: enrollment.createdAt,

    updatedAt: enrollment.updatedAt,
  };
};
