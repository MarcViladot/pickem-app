import Api from './api';
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseApiEmpty, ResponseServerError} from '../utils/IResponse';
import {AddLeagueDto, CreateGroupDto} from '../interfaces/group.interface';
import {Group} from '../interfaces/user.interface';

export default {

    create(data: CreateGroupDto) {
        return Api.post(`group/create`, data)
            .then((r: AxiosResponse<ResponseApi<Group>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    joinGroup(invitationCode: string) {
        return Api.post(`group/join/${invitationCode}`, {})
            .then((r: AxiosResponse<ResponseApiEmpty>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    addLeagues(data: AddLeagueDto) {
        return Api.post(`group/add-leagues`, data)
            .then((r: AxiosResponse<ResponseApi<Group>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
