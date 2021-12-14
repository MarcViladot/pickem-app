import {AnyAction} from 'redux';
import {SHOW_SNACKBAR} from '../actions/utils/showSnackbar';
import {HIDE_PROGRESS_BAR} from '../actions/utils/hideBar';
import {SHOW_PROGRESS_BAR} from '../actions/utils/showBar';
import {HIDE_SNACKBAR} from '../actions/utils/hideSnackbar';

const initialState = {
    showProgressBar: false,
    snackbarConfig: {
        open: false,
        message: '',
        variant: '',
    },
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SHOW_PROGRESS_BAR) {
        return {
            ...state,
            showProgressBar: true
        };
    } else if (action.type === HIDE_PROGRESS_BAR) {
        return {
            ...state,
            showProgressBar: false
        };
    } else if (action.type === SHOW_SNACKBAR) {
        return {
            ...state,
            snackbarConfig: {
                open: true,
                message: action.payload.message,
                variant: action.payload.variant,
            }
        };
    } else if (action.type === HIDE_SNACKBAR) {
        return {
            ...state,
            snackbarConfig: {
                open: false,
                message: '',
                variant: '',
            }
        };
    }
    return state;
};
