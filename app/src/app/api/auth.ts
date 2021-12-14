import Api from "./api";
import { AxiosError, AxiosResponse } from "axios";
import { ResponseApi, ResponseServerError } from "../utils/IResponse";
import { CreateUser, User, UserCredentials } from "../interfaces/user.interface";

export default {

  login(credentials: UserCredentials) {
    return Api.post(`auth/login`, credentials)
      .then((r: AxiosResponse<ResponseApi<User>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  },

  autoLogin() {
    return Api.get(`auth/loginAuth`)
      .then((r: AxiosResponse<ResponseApi<User>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      });
  },

  createUser(data: CreateUser) {
    return Api.post(`auth/create`, data)
      .then((r: AxiosResponse<ResponseApi<User>>) => {
        return r.data
      }, (err: AxiosError) => {
        return new ResponseServerError(err);
      })
  },

};
