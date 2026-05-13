import { Role } from '@prisma/client';

export type AuthJwtUser = {
  sub: string;
  email: string;
  role: Role;
};
