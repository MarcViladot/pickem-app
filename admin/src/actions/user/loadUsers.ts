import user from '../../api/user';
import {setUsers} from './setUsers';
import {Dispatch} from 'redux';

export const loadUsers = () => {
    return async (dispatch: Dispatch) => {
        const res = await user.getAll()
        if (!res.IsError) {
            return dispatch(setUsers(res.Result));
        } else {

        }
    }
};
