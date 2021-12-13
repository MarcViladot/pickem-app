import {User} from '../../interfaces/User';

export const SET_USER = "SET_USER";
export const setUser = (user: User) => {
    return {
        type: SET_USER,
        payload: user
    };
};
