import user from '../../api/user';
import {setUsers} from './setUsers';
import {Dispatch} from 'redux';
import {showResErrorSnackbar} from '../utils/showSnackbar';
import {UserResult} from '../../interfaces/User';
import {ResponseApi} from '../../utils/IResponse';

export const loadUsers = () => {
    return async (dispatch: Dispatch) => {
        const res: ResponseApi<UserResult> = await user.getAll()
        if (!res.IsError) {
            return dispatch(setUsers(res.Result.parsedUsers));
        } else {
            dispatch(showResErrorSnackbar(res));
        }
    }
};
