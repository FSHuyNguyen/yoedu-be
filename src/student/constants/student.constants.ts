import { Prisma } from '@prisma/client';

import { USER_SELECT } from '../../user/constants/user.constants';

export const STUDENT_INCLUDE = {
  user: {
    select: USER_SELECT,
  },
} satisfies Prisma.StudentInclude;
