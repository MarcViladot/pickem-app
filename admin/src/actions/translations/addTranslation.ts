import {TranslationGroup} from '../../interfaces/League';

export const ADD_TRANSLATION = "ADD_TRANSLATION";
export const addTranslation = (translation: TranslationGroup) => {
    return {
        type: ADD_TRANSLATION,
        payload: translation
    };
};
