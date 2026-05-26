/* Prefix role + timestamp */
export const generateCode = (prefix: string) => {
  const now = new Date();

  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const timestamp = now.getTime();

  return `Yoedu-${prefix}-${day}${month}${year}-${timestamp}`;
};
