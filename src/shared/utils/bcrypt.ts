import * as bcrypt from 'bcrypt';

export const encrypt = async (data: string) => {
  return await bcrypt.hash(data, 10);
};

export const compare = async (data: string, hashedData: string) => {
  return await bcrypt.compare(data, hashedData);
};
