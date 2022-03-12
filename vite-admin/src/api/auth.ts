import API from './api';
import { AxiosError, AxiosResponse } from 'axios';
import {User} from '../interfaces/User';
import {ResponseApi, ResponseServerError} from '../utils/IResponse';

const auth = {
  getCurrentUserAdmin() {
    return API.get(`auth/loginAuthAdmin`).then(
      (r: AxiosResponse<ResponseApi<User>>) => {
        return r.data;
      },
      (err: AxiosError) => {
        return new ResponseServerError(err);
      },
    );
  },
};

export default auth;
