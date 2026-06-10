/* Prefix role + timestamp */
export const generateCode = (prefix: string) => {
  const now = new Date();

  const timestamp = now.getTime();

  return `${prefix}${timestamp}`;
};
