import API from './api'
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';
import {User, UserResult} from '../interfaces/User';

export default {


    getAll() {
        return API.get(`user/-1/null`)
            .then((r: AxiosResponse<ResponseApi<UserResult>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    getByEmail(email: string) {
        return API.get(`user/byEmail/${email}`)
            .then((r: AxiosResponse<ResponseApi<User[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
