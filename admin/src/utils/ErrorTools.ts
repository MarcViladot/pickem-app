import {ResponseApiError, WebApiCodesMap, WebApiErrorCode} from './IResponse';

export class ErrorTools {

  public static getApiErrorMsg(errorCode: number, params: string[]): string {
    let msg = WebApiCodesMap.get(errorCode);
    if (msg) {
      try {
        if (params) {
          for (let i = 0; i < params.length; i++) {
            msg = msg.replace('{' + i + '}', params[i] ? params[i] : '');
          }
        }
      } catch (e) {
        return msg;
      }
      return msg;
    }
    return 'Unexpected error';
  }

  static getApiErrorMsgFromResponse(res: ResponseApiError): string {
    return ErrorTools.getApiErrorMsg(res.ErrorCode, res.ErrorParams);
  }

}
