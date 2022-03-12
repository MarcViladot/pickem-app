import API from './api';
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';
import {CreateTeam, Team} from '../interfaces/Team';

export default {

    getAll() {
        return API.get(`team`)
            .then((r: AxiosResponse<ResponseApi<Team[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    createTeam(data: CreateTeam) {
        return API.post(`team`, data)
            .then((r: AxiosResponse<ResponseApi<Team[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
