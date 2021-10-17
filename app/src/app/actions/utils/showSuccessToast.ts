import i18next from 'i18next';
import Toast from 'react-native-toast-message';

export const SHOW_SUCCESS_TOAST = 'SHOW_SUCCESS_TOAST';
export const showSuccessToast = (msg?: string) => {
  Toast.show({
    text1: msg || i18next.t('COMMON.OPERATION_OK'),
    type: 'success',
    position: 'bottom',
  });
  return {
    type: SHOW_SUCCESS_TOAST,
  };
};
