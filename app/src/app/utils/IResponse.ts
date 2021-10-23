import {AxiosError} from 'axios';

export interface ResponseApi<resType> {
    ErrorCode: number;
    ErrorParams: string[];
    ErrorDetail: string;
    Result: resType;
    IsError: boolean;
}

export interface ResponseApiEmpty extends ResponseApi<boolean> {
}

export class ResponseApiError implements ResponseApi<any> {

    IsError: boolean;
    Result: any;
    ErrorDetail: string;
    ErrorCode: WebApiErrorCode;
    ErrorParams: string[];

    constructor(api: ResponseApi<any>, errorCode = -2) {
        this.IsError = true;
        this.Result = null;
        this.ErrorDetail = '';
        if (api) {
            this.ErrorDetail = api.ErrorDetail;
            this.ErrorCode = api.ErrorCode;
            this.ErrorParams = api.ErrorParams;
        } else {
            this.ErrorCode = errorCode;
            this.ErrorParams = [];
        }
    }
}

export class ResponseServerError implements ResponseApi<any> {

    IsError: boolean;
    Result: any;
    ErrorDetail: string;
    ErrorCode: WebApiErrorCode;
    ErrorParams: string[];

    constructor(err: AxiosError) {
        this.IsError = true;
        this.Result = null;
        this.ErrorCode = -2;
        this.ErrorParams = [];
        this.ErrorDetail = `${err.config?.method?.toUpperCase()} - ${err.response?.status}\n\n ${err.config.baseURL}${err.config.url}`;
        console.log(this.ErrorDetail);
    }
}

export enum WebApiErrorCode {
    // -----------------------------------------
    // ERROR CODES COMMON FOR ALL apps
    // -----------------------------------------
    ServerConnectionError = -2,
    Unexpected = -1,
    Success = 0,

    UserNotFound = 100,             // id
    UserIncorrectCredentials,

    LeagueNotFound = 200,           // id

    RoundNotFound = 300,            // id

    MatchNotFound = 400,             // id
    MatchAlreadyFinished = 401


}
