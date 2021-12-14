import {AxiosError} from 'axios';

export interface ResponseApi<resType> {
    ErrorCode: number;
    ErrorParams: string[];
    ErrorDetail: string;
    // ReqReceivedDate?: Date | string;
    // GeneratedDate?: Date | string;
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
    // ReqReceivedDate: Date;
    // GeneratedDate: Date;

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
        this.ErrorDetail = `${err.config?.method?.toUpperCase()} - ${err.response?.status}\n\n ${err.config.baseURL}${err.config.url}`;
        this.ErrorParams = [];
    }
}

export enum WebApiErrorCode {
    ServerConnectionError = -2,
    Unexpected = -1,
    Success = 0,
    FirebaseError = 1
}

export const WebApiCodesMap = new Map([
    [WebApiErrorCode.ServerConnectionError, 'Server connection error'],
    [WebApiErrorCode.Unexpected, 'Unexpected error'],
]);
