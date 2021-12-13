import {AnyAction} from 'redux';
import {SET_USER} from '../actions/auth/setUser';
import {SET_USERS} from '../actions/user/setUsers';
import {User} from '../interfaces/User';

interface State {
    isLoggedIn: boolean;
    hasToken: boolean;
    currentUser: User | null,
    all: User[]
}

const initialState: State = {
    isLoggedIn: false,
    hasToken: !!localStorage.getItem('pickem_token'),
    currentUser: null,
    all: []
};

export default(state = initialState, action: AnyAction) => {
    if (action.type === SET_USER) {
        return {
            ...state,
            currentUser: action.payload,
            isLoggedIn: true,
            hasToken: true
        };
    } else if (action.type === "LOGOUT") {
        localStorage.removeItem('pickem_token');
        return {
            ...state,
            currentUser: null,
            isLoggedIn: false,
            hasToken: false
        };
    } else if (action.type === SET_USERS) {
        localStorage.removeItem('pickem_token');
        return {
            ...state,
            all: action.payload
        };
    }
    return state;
};
