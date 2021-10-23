import {ResponseApiError, WebApiErrorCode} from '../../utils/IResponse';
import {ErrorTools} from '../../utils/ErrorTools';
import Toast from 'react-native-toast-message';
import i18next from 'i18next';

export const SHOW_TOAST = "SHOW_TOAST";
export const showApiErrorToast = (res: ResponseApiError) => {
    const translation = ErrorTools.getApiErrorMsgFromResponse(res);
    Toast.show({
        text1: i18next.t(translation.error, translation.paramsToTranslate),
        type: res.ErrorCode !== -2 ? 'apiError' : 'serverError',
        position: 'bottom',
        props: res
    });
    return {
        type: SHOW_TOAST
    }
};
