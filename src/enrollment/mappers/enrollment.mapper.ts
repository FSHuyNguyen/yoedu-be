import { EnrollmentStatus, Prisma } from '@prisma/client';
import { USER_INCLUDE } from '../../user/constants/user.constants';

export const ENROLLMENT_INCLUDE = {
  student: {
    include: USER_INCLUDE,
  },
  course: true,
} satisfies Prisma.EnrollmentInclude;

type EnrollmentResponse = Prisma.EnrollmentGetPayload<{
  include: typeof ENROLLMENT_INCLUDE;
}>;

const mappedStatusText: Record<string, string> = {
  [EnrollmentStatus.STUDYING]: 'Đang học',
  [EnrollmentStatus.COMPLETED]: 'Hoàn thành',
  [EnrollmentStatus.CANCELLED]: 'Đã hủy',
};

export const mapEnrollmentResponse = (enrollment: EnrollmentResponse) => {
  return {
    id: enrollment.id,

    studentId: enrollment.studentId,
    studentName: enrollment.student.user.fullName,

    courseId: enrollment.courseId,
    courseName: enrollment.course.name,

    originalPrice: enrollment.originalPrice,
    paidAmount: enrollment.paidAmount,

    status: enrollment.status,

    statusText: mappedStatusText[enrollment.status],

    note: enrollment.note,

    createdAt: enrollment.createdAt,

    updatedAt: enrollment.updatedAt,
  };
};
