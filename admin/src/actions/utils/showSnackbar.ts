import {ResponseApiError, WebApiErrorCode} from '../../utils/IResponse';
import {ErrorTools} from '../../utils/ErrorTools';

export const SHOW_SNACKBAR = "SHOW_SNACKBAR";
const showSnackbar = (message: string, variant: string) => {
    return {
        type: SHOW_SNACKBAR,
        payload: {
            message,
            variant
        }
    }
};

export const showErrorSnackbar = (message: string) => {
    return showSnackbar(message, 'error');
};

export const showResErrorSnackbar = (res: ResponseApiError) => {
    if (res.ErrorCode === WebApiErrorCode.FirebaseError) {
        return showSnackbar(res.ErrorDetail, 'error');
    }
    const message = ErrorTools.getApiErrorMsgFromResponse(res);
    return showSnackbar(message, 'error');
};

export const showSuccessSnackbar = (message: string) => {
    return showSnackbar(message, 'success');
};
