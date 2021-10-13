import {User} from '../../interfaces/User';

export const SET_USERS = "SET_USERS";
export const setUsers = (users: User[]) => {
    return {
        type: SET_USERS,
        payload: users
    };
};
