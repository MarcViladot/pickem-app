import API from './api'
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';
import {User} from '../interfaces/User';

export default {


    getAll() {
        return API.get(`user`)
            .then((r: AxiosResponse<ResponseApi<User[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
