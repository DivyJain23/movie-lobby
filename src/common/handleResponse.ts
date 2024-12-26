import { AppSuccess } from '../constants/appCode';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatSuccessMessage(data?: any) {
  return {
    success: true,
    msg: AppSuccess.MESSAGE,
    data
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatErrorMessage(error: any, data?: any) {
  return {
    success: false,
    code: error?.status || 400,
    msg: error?.msg || error?.message || JSON.stringify(error),
    data
  };
}