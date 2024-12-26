import { AppSuccess } from '../constants/appCode';

export function formatSuccessMessage(data?: any) {
    return {
        success: true,
        msg: AppSuccess.MESSAGE,
        data
    };
}

export function formatErrorMessage(error: any, data?: any) {
    return {
        success: false,
        code: error?.status || 400,
        msg: error?.msg || error?.message || JSON.stringify(error),
        data
    };
}