import { Prisma } from '@prisma/client';
import { STUDENT_INCLUDE } from '../constants/student.constants';

type StudentResponse = Prisma.StudentGetPayload<{
  include: typeof STUDENT_INCLUDE;
}>;

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

    createdAt: student.user.createdAt,

    updatedAt: student.user.updatedAt,
  };
};
