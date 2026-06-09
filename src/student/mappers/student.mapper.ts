import { Prisma, StudentStatus } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

export const STUDENT_INCLUDE = {
  ...BASE_USER_INCLUDE,
  parent: {
    include: BASE_USER_INCLUDE,
  },
} satisfies Prisma.StudentInclude;

type StudentResponse = Prisma.StudentGetPayload<{
  include: typeof STUDENT_INCLUDE;
}>;

const mappedStudentStatusText: Record<StudentStatus, string> = {
  ACTIVE: 'Đang tham gia',
  PAUSED: 'Đã tạm ngưng',
  DROPPED: 'Đã nghỉ học',
};

export const mapStudentResponse = (student: StudentResponse) => {
  return {
    id: student.id,

    userId: student.user.id,

    parentId: student.parentId,

    parentName: student.parent ? student.parent.user.fullName : '',

    studentCode: student.studentCode,

    schoolName: student.schoolName,

    gradeLevel: student.gradeLevel,

    entryAcademicLevel: student.entryAcademicLevel,

    latestTestScore: Number(student.latestTestScore),

    learningGoal: student.learningGoal,

    note: student.note,

    studentStatus: student.status,

    studentStatusText: mappedStudentStatusText[student.status],

    email: student.user.email,

    fullName: student.user.fullName,

    phone: student.user.phone,

    address: student.user.address,

    avatarUrl: student.user.avatarUrl,

    gender: student.user.gender,

    dateOfBirth: student.user.dateOfBirth,

    role: student.user.role,

    userStatus: student.user.status,

    createdAt: student.createdAt,

    updatedAt: student.updatedAt,
  };
};
