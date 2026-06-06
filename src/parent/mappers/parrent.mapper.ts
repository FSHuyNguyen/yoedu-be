import { Prisma } from '@prisma/client';
import { BASE_USER_INCLUDE } from '../../user/constants/user.constants';

export const PARENT_INCLUDE = {
  ...BASE_USER_INCLUDE,
} satisfies Prisma.ParentInclude;

type ParentResponse = Prisma.ParentGetPayload<{
  include: typeof PARENT_INCLUDE;
}>;

export const mapParentResponse = (parent: ParentResponse) => {
  return {
    id: parent.id,

    userId: parent.user.id,

    email: parent.user.email,

    fullName: parent.user.fullName,

    phone: parent.user.phone,

    address: parent.user.address,

    avatarUrl: parent.user.avatarUrl,

    gender: parent.user.gender,

    dateOfBirth: parent.user.dateOfBirth,

    role: parent.user.role,

    userStatus: parent.user.status,

    createdAt: parent.createdAt,

    updatedAt: parent.updatedAt,
  };
};
