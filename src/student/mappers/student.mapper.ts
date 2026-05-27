import { Prisma, Status } from '@prisma/client';
import { USER_INCLUDE } from '../../user/constants/user.constants';

type StudentResponse = Prisma.StudentGetPayload<{
  include: typeof USER_INCLUDE;
}>;

const mappedStatusText: Record<string, string> = {
  [Status.ACTIVE]: 'Hoạt động',
  [Status.INACTIVE]: 'Không hoạt động',
  [Status.DELETED]: 'Đã xóa',
};

export const mapStudentResponse = (student: StudentResponse) => {
  return {
    id: student.id,

    userId: student.user.id,

    studentCode: student.studentCode,

    parentName: student.parentName,
    parentPhone: student.parentPhone,

    schoolName: student.schoolName,
    grade: student.grade,

    entryAcademicLevel: student.entryAcademicLevel,

    latestTestScore: student.latestTestScore,

    learningGoal: student.learningGoal,

    note: student.note,

    joinedAt: student.joinedAt,

    email: student.user.email,

    fullName: student.user.fullName,

    phone: student.user.phone,

    address: student.user.address,

    avatarUrl: student.user.avatarUrl,

    gender: student.user.gender,

    dateOfBirth: student.user.dateOfBirth,

    role: student.user.role,

    status: student.user.status,

    statusText: mappedStatusText[student.user.status],

    createdAt: student.user.createdAt,

    updatedAt: student.user.updatedAt,
  };
};
