import {ResponseApi, WebApiErrorCode} from './IResponse';


export class ErrorTools {

    public static getApiErrorMsg(errorCode: number, params: string[]) {
        const error = `ERRORS.${WebApiErrorCode[errorCode] || 'Unexpected'}`;
        const paramsToTranslate: any = {};
        if (params) {
            params.forEach((param, i) => paramsToTranslate[`p${i + 1}`] = param);
        }
        return {error, paramsToTranslate};
    }

    static getApiErrorMsgFromResponse(res: ResponseApi<any>) {
        return ErrorTools.getApiErrorMsg(res.ErrorCode, res.ErrorParams);
    }

}
