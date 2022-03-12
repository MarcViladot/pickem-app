import API from './api';
import { AxiosError, AxiosResponse } from 'axios';
import { ResponseApi, ResponseServerError } from '../utils/IResponse';
import { CreateTeam, Team } from '../interfaces/Team';
import { TranslationGroup, TranslationGroupDto } from '../interfaces/League';

export default {

  getAll(): Promise<ResponseApi<TranslationGroup[]>> {
    return API.get(`round/translationGroups`).then(
      (r: AxiosResponse<ResponseApi<TranslationGroup[]>>) => {
        return r.data;
      },
      (err: AxiosError) => {
        return new ResponseServerError(err);
      },
    );
  },

  newTranslationGroup(data: TranslationGroupDto): Promise<ResponseApi<TranslationGroup>> {
    return API.post(`round/translationGroup`, data).then(
      (r: AxiosResponse<ResponseApi<TranslationGroup>>) => {
        return r.data;
      },
      (err: AxiosError) => {
        return new ResponseServerError(err);
      },
    );
  },
};
