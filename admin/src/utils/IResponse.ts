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
    // ReqReceivedDate: Date;
    // GeneratedDate: Date;

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
    AkkaTimeout = 1,

    UserController = 100,
    UserController_WrongUserNameOrPassword = 101,           // no params
    UserController_WrongUserNameOrCode = 102,               // no params
    UserController_WrongToken_NoClaimNameIdentifier = 103,  // no params
    UserController_WrongToken_NoClaimGivenName = 104,       // no params
    UserController_WrongToken_NoClaimRole = 105,           // no params
    UserController_WrongToken_BadClaimNameIdentifier = 106, // params: token user id
    UserController_WrongToken_BadClaimRole = 107,           // params: token role id
    UserController_WrongToken_BadClaimRoleId = 108,         // params: token role id
    UserController_UserDeleted = 109,                       // no params

    WarehouseController_UnknownPalletLabel = 200,           // params: label

    TerminalController_WrongUserNameOrCode = 300,           // no params
    TerminalController_CustomerNotExists = 301,             // params: customerId
    TerminalController_PalletLabelAlreadyExists = 302,      // params: label
    TerminalController_PalletTagAlreadyExists = 303,        // params: tag
    TerminalController_PalletLabelEmpty = 304,              // no params
    TerminalController_PalletTagEmpty = 305,               // no params
    TerminalController_LabelNotFound = 306,                 // params: label
    TerminalController_AlreadyStoredInAutoLocation = 307,   // params: channel label, posZ, aisleId
    TerminalController_WarehouseChannelFull = 308,          // no params
    TerminalController_AlreadyStoredInManLocation = 309,    // params: man label
    TerminalController_PalletNotFound = 310,                // no params
    TerminalController_NotFrontLocation = 311,              // no params
    TerminalController_MoveAlreadyCompleted = 312,          // no params
    TerminalController_TerminalNotRegistered = 313,         // params: termIp
    TerminalController_AssignedToAnotherTerminal = 314,     // params: termIp
    TerminalController_AllDestinationsOccupied = 315,       // no params
    TerminalController_WarehouseFull = 316,                 // params: minFreeLocs
    TerminalController_RackingFull = 317,                   // params: aisleIds

    TerminalController_PalletAlreadyInPlace = 318,          // noparams
    TerminalController_PalletDoesntHaveMove = 319,         // noparams
    TerminalController_LocationAlreadyOccupied = 320,      // params: pallet label occupying the location
    TerminalController_AlreadyAssignedToAnotherMove = 321,  // noparams
    TerminalController_AlreadyAssignedToHighMove = 322,     // noparams
    TerminalController_MustBeAisleRack = 323,              // noparams
    TerminalController_PalletInHighMove = 324              // noparams
}

export const WebApiCodesTranslationMap = new Map([
    [WebApiErrorCode.ServerConnectionError, 'ERRORS.SERVER_CONNECTION'],
    [WebApiErrorCode.Unexpected, 'ERRORS.UNEXPECTED_ERROR'],
    [WebApiErrorCode.AkkaTimeout, 'ERRORS.AKKA_TIMEOUT'],
    [WebApiErrorCode.WarehouseController_UnknownPalletLabel, 'ERRORS.UNKNOWN_PALLET_LABEL'],
    [WebApiErrorCode.TerminalController_WrongUserNameOrCode, 'AUTH.CREDENTIALS_ERROR'],
    [WebApiErrorCode.TerminalController_CustomerNotExists, 'ERRORS.CUSTOMER_NOT_EXISTS'],
    [WebApiErrorCode.TerminalController_PalletLabelAlreadyExists, 'ERRORS.PALLET_LABEL_ALREADY_EXISTS'],
    [WebApiErrorCode.TerminalController_PalletTagAlreadyExists, 'ERRORS.PALLET_TAG_ALREADY_EXISTS'],
    [WebApiErrorCode.TerminalController_PalletLabelEmpty, 'ERRORS.PALLET_LABEL_EMPTY'],
    [WebApiErrorCode.TerminalController_PalletTagEmpty, 'ERRORS.PALLET_TAG_EMPTY'],
    [WebApiErrorCode.TerminalController_LabelNotFound, 'ERRORS.LABEL_NOT_FOUND'],
    [WebApiErrorCode.TerminalController_AlreadyStoredInAutoLocation, 'ERRORS.ALREADY_STORED_AUTO_LOCATION'],
    [WebApiErrorCode.TerminalController_WarehouseChannelFull, 'ERRORS.WAREHOUSE_CHANNEL_FULL'],
    [WebApiErrorCode.TerminalController_AlreadyStoredInManLocation, 'ERRORS.ALREADY_STORED_MANUAL_LOCATION'],
    [WebApiErrorCode.TerminalController_PalletNotFound, 'ERRORS.PALLET_NOT_FOUND'],
    [WebApiErrorCode.TerminalController_NotFrontLocation, 'ERRORS.NOT_FRONT_LOCATION'],

    [WebApiErrorCode.TerminalController_MoveAlreadyCompleted, 'ERRORS.MOVE_ALREADY_COMPLETED'],
    [WebApiErrorCode.TerminalController_TerminalNotRegistered, 'ERRORS.TERMINAL_NOT_REGISTERED'],
    [WebApiErrorCode.TerminalController_AssignedToAnotherTerminal, 'ERRORS.ASSIGNED_TO_ANOTHER_TERMINAL'],
    [WebApiErrorCode.TerminalController_AllDestinationsOccupied, 'ERRORS.RACKING_FULL'],
    [WebApiErrorCode.TerminalController_WarehouseFull, 'ERRORS.WAREHOUSE_FULL'],
    [WebApiErrorCode.TerminalController_RackingFull, 'ERRORS.RACKING_FULL_FOR_AISLES'],
    [WebApiErrorCode.TerminalController_PalletInHighMove, 'ERRORS.PALLET_IN_HIGHMOVE'],
]);
