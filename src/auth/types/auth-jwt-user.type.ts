export type AuthJwtUser = {
  sub: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
};
