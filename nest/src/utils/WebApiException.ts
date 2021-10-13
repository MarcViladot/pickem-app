import { HttpException, HttpStatus } from '@nestjs/common';
import { ResponseApiError, WebApiResponseCode } from './ResponseApi';

export class WebApiException extends HttpException {
  constructor(errorCode: WebApiResponseCode, errorParams: (string | number)[], errorDetail = null) {
    if (errorDetail) {
      errorDetail = JSON.stringify(errorDetail, Object.getOwnPropertyNames(errorDetail));
    }
    super(new ResponseApiError(errorCode, errorParams, errorDetail), HttpStatus.OK);
  }
}
