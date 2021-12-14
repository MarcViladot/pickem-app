export class ResponseApi<resType> {
  Result: resType;
  IsError: boolean;
  ErrorCode: WebApiResponseCode;
  ErrorParams: (string | number)[];
  ErrorDetail: string;

  constructor(result: any, IsError: boolean, errorCode: WebApiResponseCode, errorParams: (string | number)[], errorDetail: string) {
    this.IsError = IsError;
    this.Result = result;
    this.ErrorCode = errorCode;
    this.ErrorDetail = errorDetail;
    this.ErrorParams = errorParams;
  }
}

export class ResponseApiSuccess extends ResponseApi<any> {

  constructor(result: any) {
    super(result, false, WebApiResponseCode.Success, [], null);
  }
}

export class ResponseApiEmpty extends ResponseApi<any> {

  constructor() {
    super(null, false, WebApiResponseCode.Success, [], null);
  }
}

export class ResponseApiError extends ResponseApi<any> {

  constructor(errorCode: WebApiResponseCode, errorParams: (string | number)[], errorDetail: string) {
    super(null, true, errorCode, errorParams, errorDetail);
  }
}

export enum WebApiResponseCode {
  ServerConnection = -2,
  Unexpected = -1,
  Success = 0,
  FirebaseError = 1,

  UserNotFound = 100,             // id
  UserEmailNotFound,             // email
  UserNotAdmin,

  LeagueNotFound = 200,           // id

  RoundNotFound = 300,            // id

  MatchNotFound = 400,             // id
  MatchAlreadyFinished = 401
}
