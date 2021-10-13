import API from '../../api/api'
import auth from '../../api/auth'
import {setUser} from './setUser'
import {User, UserCredentials} from '../../interfaces/User';
import {Dispatch} from 'redux';
import {ResponseApi} from '../../utils/IResponse';
import {loadTeams} from '../teams/loadTeams';

export const login = (values: UserCredentials) => {
    return async (dispatch: Dispatch) => {
        const res = await auth.login(values) as ResponseApi<User>;
        if (!res.IsError) {
            const bearer = `Bearer ${res.Result.token}`
            localStorage.setItem('pickem_token', bearer);
            API.defaults.headers['Authorization'] = bearer;
            return dispatch(setUser(res.Result));
        } else {

        }
    }
};
