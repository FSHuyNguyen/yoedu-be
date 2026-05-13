import { StatusCode } from './status';

export type IApiResponse = {
  success: boolean;
  statusCode: (typeof StatusCode)[keyof typeof StatusCode];
  message: string;
  data?: any;
  timestamp: string;
};

export const CustomResponse = (
  success: boolean,
  statusCode: (typeof StatusCode)[keyof typeof StatusCode],
  message: string,
  data?: any,
): IApiResponse => {
  return {
    success,
    statusCode,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};
