import {TranslationGroup} from '../../interfaces/League';

export const SET_TRANSLATIONS = "SET_TRANSLATIONS";
export const setTranslations = (trans: TranslationGroup[]) => {
    return {
        type: SET_TRANSLATIONS,
        payload: trans
    };
};
