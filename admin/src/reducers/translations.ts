import {AnyAction} from 'redux';
import {SET_TRANSLATIONS} from '../actions/translations/setTranslations';
import {ADD_TRANSLATION} from '../actions/translations/addTranslation';

const initialState = {
    translations: []
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_TRANSLATIONS) {
        return {
            ...state,
            translations: action.payload
        };
    } else if (action.type === ADD_TRANSLATION) {
        return {
            ...state,
            translations: [...state.translations, action.payload]
        };
    }
    return state;
}
