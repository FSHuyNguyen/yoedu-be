import { Role } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  password: string;
  fullName?: string;
  role: Role;
};
