// import {SHOW_LOADING} from '../actions/utils/showLoading';
// import {HIDE_LOADING} from '../actions/utils/hideLoading';
// import {SET_LANG} from '../actions/utils/setLang';
import { AnyAction } from "redux";

const initialState = {
    serverLoading: false,
    currentLang: null
};

export default (state = initialState, action: AnyAction) => {
    /*if (action.type === SHOW_LOADING) {
        return {
            ...state,
            serverLoading: true
        };
    } else if (action.type === HIDE_LOADING) {
        return {
            ...state,
            serverLoading: false
        };
    } else if (action.type === SET_LANG) {
        return {
            ...state,
            currentLang: action.lang
        };
    }*/
    return state;
};
