/* Prefix role + timestamp*/
export const generateCode = (prefix: string) => {
  const random = Math.floor(1000 + Math.random() * 9000);

  return `${prefix}-${Date.now()}-${random}`;
};
