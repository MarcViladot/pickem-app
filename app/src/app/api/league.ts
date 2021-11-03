import { User, UserCredentials } from "../interfaces/user.interface";
import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";

export default {

  getGroupLeague(groupId: number, leagueId: number) {
    return Api.get(`league/getGroupLeague/${groupId}/${leagueId}`)
      .then((r: AxiosResponse<ResponseApi<any>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  }
}
