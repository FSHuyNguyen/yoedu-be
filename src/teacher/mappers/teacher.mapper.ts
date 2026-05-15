import { Prisma } from '@prisma/client';
import { USER_INCLUDE } from '../../user/constants/user.constants';

type TeacherResponse = Prisma.TeacherGetPayload<{
  include: typeof USER_INCLUDE;
}>;

export const mapTeacherResponse = (teacher: TeacherResponse) => {
  return {
    id: teacher.id,

    userId: teacher.user.id,

    teacherCode: teacher.teacherCode,

    bio: teacher.bio,

    specialization: teacher.specialization,

    qualification: teacher.qualification,

    yearsOfExperience: teacher.yearsOfExperience,

    note: teacher.note,

    joinedAt: teacher.joinedAt,

    email: teacher.user.email,

    fullName: teacher.user.fullName,

    phone: teacher.user.phone,

    address: teacher.user.address,

    avatarUrl: teacher.user.avatarUrl,

    gender: teacher.user.gender,

    dateOfBirth: teacher.user.dateOfBirth,

    role: teacher.user.role,

    status: teacher.user.status,

    createdAt: teacher.user.createdAt,

    updatedAt: teacher.user.updatedAt,
  };
};
