import API from './api';
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';
import {DashboardInfo} from '../interfaces/Dashboard';

export default {

    getDashboardInfo() {
        return API.get(`dashboard/info`)
            .then((r: AxiosResponse<ResponseApi<DashboardInfo>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
