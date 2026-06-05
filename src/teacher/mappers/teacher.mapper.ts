import { Prisma, TeacherStatus } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

type TeacherResponse = Prisma.TeacherGetPayload<{
  include: typeof BASE_USER_INCLUDE;
}>;

const mappedStatusText: Record<TeacherStatus, string> = {
  ACTIVE: 'Đang giảng dạy',
  PAUSED: 'Tạm nghỉ',
  INACTIVE: 'Ngừng công tác',
};

const mappedTeacherRoleText: Record<string, string> = {
  TEACHER: 'Giáo viên',
  ASSISTANT: 'Trợ giảng',
  BOTH: 'Giáo viên kiêm trợ giảng',
};

export const mapTeacherResponse = (teacher: TeacherResponse) => {
  return {
    id: teacher.id,

    userId: teacher.user.id,

    teacherCode: teacher.teacherCode,

    teacherRole: teacher.teacherRole,

    teacherRoleText: mappedTeacherRoleText[teacher.teacherRole],

    specialization: teacher.specialization,

    qualification: teacher.qualification,

    yearsOfExperience: teacher.yearsOfExperience,

    note: teacher.note,

    teacherStatus: teacher.status,

    teacherStatusText: mappedStatusText[teacher.status],

    email: teacher.user.email,

    fullName: teacher.user.fullName,

    phone: teacher.user.phone,

    address: teacher.user.address,

    avatarUrl: teacher.user.avatarUrl,

    gender: teacher.user.gender,

    dateOfBirth: teacher.user.dateOfBirth,

    role: teacher.user.role,

    userStatus: teacher.user.status,

    lastLoginAt: teacher.user.lastLoginAt,

    createdAt: teacher.createdAt,

    updatedAt: teacher.updatedAt,
  };
};
