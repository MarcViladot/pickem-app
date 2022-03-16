import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";
import {IAppDashboard} from '../interfaces/dashboard.interface';

export default {

    getDashboardApp() {
        return Api.get(`dashboard/app`)
            .then((r: AxiosResponse<ResponseApi<IAppDashboard>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },
}
