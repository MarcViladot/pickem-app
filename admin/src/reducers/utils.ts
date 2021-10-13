import {AnyAction} from 'redux';

const initialState = {
    showProgressBar: false,
    lang: localStorage.getItem('currentLang')
};

export default(state = initialState, action: AnyAction) => {
    if (action.type === "SHOW_PROGRESS_BAR") {
        return {
            ...state,
            showProgressBar: true
        };
    } else if (action.type === "HIDE_PROGRESS_BAR") {
        return {
            ...state,
            showProgressBar: false
        };
    }
    return state;
};
