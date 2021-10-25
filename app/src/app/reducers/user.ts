import {SET_USER} from '../actions/auth/setUser';
import {LOGOUT} from '../actions/auth/logout';
import { AnyAction } from "redux";
import { User } from "../interfaces/user.interface";

export interface State {
    isLoggedIn: false;
    currentUser: User;
}

const initialState: State = {
    isLoggedIn: false,
    currentUser: null,
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
