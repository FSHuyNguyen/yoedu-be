/* Prefix role + timestamp*/
export const generateStudentCode = () => {
  return `STU-${Date.now()}`;
};
