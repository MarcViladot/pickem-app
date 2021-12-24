import user from '../../api/user';
import {Dispatch} from 'redux';
import {showResErrorSnackbar} from '../utils/showSnackbar';
import {UserResult} from '../../interfaces/User';
import {ResponseApi} from '../../utils/IResponse';
import translations from '../../api/translations';
import {TranslationGroup} from '../../interfaces/League';
import {setTranslations} from './setTranslations';

export const loadTranslations = () => {
    return async (dispatch: Dispatch) => {
        const res: ResponseApi<TranslationGroup[]> = await translations.getAll()
        if (!res.IsError) {
            return dispatch(setTranslations(res.Result));
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }
};
