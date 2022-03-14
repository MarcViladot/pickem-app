import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";
import {ILeagueInfo, Round} from '../interfaces/league.interface';
import {LeagueType} from '../interfaces/user.interface';

export default {

  getGroupLeague(groupId: number, leagueId: number) {
    return Api.get(`league/getGroupLeague/${groupId}/${leagueId}`)
      .then((r: AxiosResponse<ResponseApi<ILeagueInfo>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  },

  getRoundDetail(roundId: number, userId: number) {
    return Api.get(`round/${roundId}/${userId}`)
      .then((r: AxiosResponse<ResponseApi<Round>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  },

  getLeagueTypes() {
    return Api.get(`league/visible`)
      .then((r: AxiosResponse<ResponseApi<LeagueType[]>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  },

}
