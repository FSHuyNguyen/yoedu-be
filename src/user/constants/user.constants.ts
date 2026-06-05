export const USER_SELECT = {
  id: true,

  email: true,

  fullName: true,

  phone: true,

  address: true,

  avatarUrl: true,

  dateOfBirth: true,

  gender: true,

  role: true,

  status: true,

  lastLoginAt: true,

  createdAt: true,

  updatedAt: true,
};

export const USER_DETAIL_SELECT = {
  ...USER_SELECT,
  student: true,
  teacher: true,
  parent: true,
};

export const BASE_USER_INCLUDE = {
  user: {
    select: USER_SELECT,
  },
};
