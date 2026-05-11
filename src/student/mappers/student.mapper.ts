type StudentResponse = {
  id: string;
  studentCode: string | null;
  parentName: string | null;
  parentPhone: string | null;
  entryAcademicLevel: string | null;
  latestTestScore: number | null;
  user: {
    fullName: string | null;
    email: string;
    phone: string | null;
    role: string | null;
    status: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
};

export const mapStudentResponse = (student: StudentResponse) => {
  return {
    ...student,
    fullName: student.user?.fullName,

    email: student.user?.email,

    phone: student.user?.phone,

    role: student.user?.role,

    status: student.user?.status,

    createdAt: student.user?.createdAt,

    updatedAt: student.user?.updatedAt,
  };
};
