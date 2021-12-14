import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";
import {LeagueInfo, Round} from '../interfaces/league.interface';

export default {

  getGroupLeague(groupId: number, leagueId: number) {
    return Api.get(`league/getGroupLeague/${groupId}/${leagueId}`)
      .then((r: AxiosResponse<ResponseApi<LeagueInfo>>) => {
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
  }
}
