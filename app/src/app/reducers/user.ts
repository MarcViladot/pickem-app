import {SET_USER} from '../actions/auth/setUser';
import {LOGOUT} from '../actions/auth/logout';
import { AnyAction } from "redux";
import { User } from "../interfaces/user.interface";
import {UPDATE_USER_PHOTO} from '../actions/user/updateUserPhoto';
import {ADD_GROUP_TO_USER} from '../actions/user/addGroupToUser';

export interface State {
    isLoggedIn: boolean;
    currentUser: User;
}

const initialState: State = {
    isLoggedIn: false,
    currentUser: null
};

export default (state = initialState, action: AnyAction) => {
    if (action.type === SET_USER) {
        return {
            ...state,
            currentUser: action.payload ,
            isLoggedIn: true
        };
    } else if (action.type === ADD_GROUP_TO_USER) {
        const group = action.payload;
        return {
            ...state,
            currentUser: {
                ...state.currentUser,
                groups: state.currentUser.groups.map(g => g.id === group.id ? group : g)
            }
        };
    } else if (action.type === LOGOUT) {
        return {
            ...state,
            currentUser: null,
            isLoggedIn: false
        };
    } else if (action.type === UPDATE_USER_PHOTO) {
        return {
            ...state,
            currentUser: {
                ...state.currentUser,
                photo: action.payload
            }
        };
    }
    return state;
};
