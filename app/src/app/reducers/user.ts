import {SET_USER} from '../actions/auth/setUser';
import {LOGOUT} from '../actions/auth/logout';
import { AnyAction } from "redux";

const initialState = {
    isLoggedIn: false,
    currentUser: null,
    loginError: ''
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_USER) {
        return {
            ...state,
            currentUser: action.payload,
            isLoggedIn: true
        };
    } else if (action.type === LOGOUT) {
        return {
            ...state,
            currentUser: null,
            isLoggedIn: false
        };
    }
    return state;
};
