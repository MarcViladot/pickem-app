import { User, UserCredentials } from "../interfaces/user.interface";
import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";
import {CreateRoundPredictionDto, UpdatePredictionDto} from '../interfaces/round.interface';

export default {

    createRoundPrediction(createRoundPredictionDto: CreateRoundPredictionDto[]) {
        return Api.post(`prediction`, createRoundPredictionDto)
            .then((r: AxiosResponse<ResponseApi<any>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    updatePrediction(updatePredictionDto: UpdatePredictionDto) {
        return Api.put(`prediction`, updatePredictionDto)
            .then((r: AxiosResponse<ResponseApi<any>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    }
}
