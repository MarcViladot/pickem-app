import API from './api'
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';
import {User, UserCredentials} from '../interfaces/User';

export default {


    login(credentials: UserCredentials) {
        return API.post(`auth/login`, credentials)
            .then((r: AxiosResponse<ResponseApi<User>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },


    autoLogin() {
        return API.get(`auth/loginAuth`)
            .then((r: AxiosResponse<ResponseApi<User>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    }
}
