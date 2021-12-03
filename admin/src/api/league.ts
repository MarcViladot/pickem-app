import {
    CreateLeague,
    CreateMatch,
    CreateRound,
    Match,
    Round, UpdateMatch,
    UpdateMatchResult,
    UpdateRound
} from './../interfaces/League';
import API from './api';
import {AxiosError, AxiosResponse} from 'axios';
import {ResponseApi, ResponseApiEmpty, ResponseServerError} from '../utils/IResponse';
import {League} from '../interfaces/League';


export default {

    getAllLeagues() {
        return API.get(`league`)
            .then((r: AxiosResponse<ResponseApi<League[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    createLeague(data: CreateLeague) {
        return API.post(`league/createLeagueType`, data)
            .then((r: AxiosResponse<ResponseApi<League[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    getLeagueDetail(id: string) {
        return API.get(`league/${id}`)
            .then((r: AxiosResponse<ResponseApi<League>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    getRoundWithMatches(id: string) {
        return API.get(`round/withMatches/${id}`)
            .then((r: AxiosResponse<ResponseApi<League>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    createRound(data: CreateRound) {
        return API.post(`round`, data)
            .then((r: AxiosResponse<ResponseApi<Round[]>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    updateRound(data: UpdateRound) {
        return API.put(`round`, data)
            .then((r: AxiosResponse<ResponseApi<Round>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    changeRoundVisibility(roundId: number, visible: boolean) {
        return API.put(`round/change-visibility`, {id: roundId, visible}
        ).then((r: AxiosResponse<ResponseApi<Round>>) => {
            return r.data
        }, (err: AxiosError) => {
            return new ResponseServerError(err);
        })
    },

    createMatch(data: CreateMatch) {
        return API.post(`match`, data)
            .then((r: AxiosResponse<ResponseApi<Round>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    updateMatch(data: UpdateMatch) {
        return API.put(`match`, data)
            .then((r: AxiosResponse<ResponseApi<Match>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    deleteMatch(id: number) {
        return API.delete(`match/${id}`)
            .then((r: AxiosResponse<ResponseApiEmpty>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

    updateMatchResult(data: UpdateMatchResult) {
        return API.put(`match/update-result`, data)
            .then((r: AxiosResponse<ResponseApi<Match>>) => {
                return r.data
            }, (err: AxiosError) => {
                return new ResponseServerError(err);
            })
    },

}
