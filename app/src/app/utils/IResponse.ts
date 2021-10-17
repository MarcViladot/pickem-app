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
    }
}

export enum WebApiErrorCode {
    // -----------------------------------------
    // ERROR CODES COMMON FOR ALL apps
    // -----------------------------------------
    ServerConnectionError = -2,
    Unexpected = -1,
    Success = 0,
    Generic_UnknownSkuLabel = 1,
    Generic_UnknownSkuCode = 2,

    UserController_WrongUserNameOrPassword = 101,           // no params
    UserController_WrongUserNameOrCode,

    PutAway_UnknownStockRackCellLabel = 200,                // stockRackCellLabel
    PutAway_UnknownSkuCode = 201,                           // skuCode
    PutAway_StockRackCellHasOtherSkus = 202,                // cellLabel
    PutAway_HighlyDemandedSkuMustBeStoredInLargeBin = 203,  // skuCode, cellLabel
    PutAway_LowDemandedSkuMustBeStoredInTrayBin = 204,      // skuCode, cellLabel
    PutAway_MaxUnitsInBinExceeded = 205,                    // maxUnits, binUnits, unitsToAdd
    PutAway_NoMaterialInboundForSku = 206,                  // skuCode
    PutAway_MoreThanOneActiveStockIdForSku = 207,           // skuCode
    PutAway_UserIsNotAssignedToStationInPutAway = 208,      // userId
    PutAway_PendingMaterialinboundUnitsExceeded = 209,      // material inbouns units, putaway units
    PutAway_NoMaterialInboundAtUserStation = 210,           // userId
    PutAway_MaterialInboundIdInProgressInAnotherStation = 211, // stationId, skuCode
    PutAway_UnknownStockMultiTuLabel = 212,                 // label
    PutAway_NoRemainingUnitsInStockMultiTu = 213,           // label
    PutAway_StationIsNotInDirectedPutAwayMode = 214,        // stationId
    PutAway_NoStockMultiTuAssignedToDirectedPutAwayInStation = 215, // no params
    PutAway_NoMaterialInboundFoundInCurrentStockMulti = 216, // stockMultiTuId, materialInboundId
    PutAway_NoUnitsInStockMultiTuOfMaterialInbound = 217,   // skuCode

    Picking_InvalidPickingStationId = 400,      // stationId
    Picking_PickingStationAlreadyAssignedToOtherUser = 401,  // PickingStationId, stationName, UserId, UserName
    Picking_ReadBinContentSkuLabelMismatch = 402,       // skuCode,skuLabel
    Picking_PickAtInactiveStationCellNum = 403,             // stationId, PutWallName, StationCellNum
    Picking_PickValidateWithMoreUntitsThanRequired = 404,   // stationId, requiredUnits, validatedUnits
    Picking_UnexpectedPickOnNotActivePutWallCell = 405,     // putWallId, posY, PosX
    Picking_StationWithPickingOperationInProgres = 406,     // stationId

    ShippingTu_NoPutWallCellBatchFound = 501,               // putwallcellbatchId
    ShippingTu_NoActiveCellToLinkTrayLabel = 502,           // no params
    ShippingTu_NoPrintFileFound = 503,                      // filename
    ShippingTu_LabelNotFound = 504,                         // label
    ShippingTu_UnexpectedZplFileName = 505,                 // filename
    ShippingTu_PrinterNotFound = 506,                       // printerName
    ShippingTu_PrinterConnectionError = 507,                // ipAddress
    ShippingTu_TrayLabelLengthDoesNotMatch = 508,           // trayLabel
    ShippingTu_StationNotFound = 509,                       // stationId
    ShippingTu_AnyFileFoundToPrint = 510,                      // stationId
    ShippingTu_PendingOrderTicketsToBePrinted = 511        // num pending tickets, label

}

export const WebApiCodesTranslationMap = new Map([
    [WebApiErrorCode.ServerConnectionError, 'ERRORS.SERVER_CONNECTION'],
    [WebApiErrorCode.Unexpected, 'ERRORS.UNEXPECTED_ERROR'],
    [WebApiErrorCode.Generic_UnknownSkuLabel, 'ERRORS.UNKNOWN_SKU_LABEL'],
    [WebApiErrorCode.Generic_UnknownSkuCode, 'ERRORS.UNKNOWN_SKU_CODE'],

    [WebApiErrorCode.UserController_WrongUserNameOrPassword, 'AUTH.CREDENTIALS_ERROR'],
    [WebApiErrorCode.UserController_WrongUserNameOrCode, 'AUTH.CREDENTIALS_ERROR'],

    [WebApiErrorCode.PutAway_UnknownStockRackCellLabel, 'ERRORS.PUT_AWAY.UNKNOWN_RACK_CELL_LABEL'],
    [WebApiErrorCode.PutAway_UnknownSkuCode, 'ERRORS.PUT_AWAY.UNKNOWN_SKU_CODE'],
    [WebApiErrorCode.PutAway_StockRackCellHasOtherSkus, 'ERRORS.PUT_AWAY.RACK_CELL_HAS_OTHER_SKUS'],
    [WebApiErrorCode.PutAway_HighlyDemandedSkuMustBeStoredInLargeBin, 'ERRORS.PUT_AWAY.HIGH_DEMAND_SKU'],
    [WebApiErrorCode.PutAway_LowDemandedSkuMustBeStoredInTrayBin, 'ERRORS.PUT_AWAY.LOW_DEMAND_SKU'],
    [WebApiErrorCode.PutAway_MaxUnitsInBinExceeded, 'ERRORS.PUT_AWAY.MAX_UNITS_EXCEEDED'],
    [WebApiErrorCode.PutAway_NoMaterialInboundForSku, 'ERRORS.PUT_AWAY.NO_MATERIAL_INBOUND_FOR_SKU'],
    [WebApiErrorCode.PutAway_MoreThanOneActiveStockIdForSku, 'ERRORS.PUT_AWAY.MORE_THAN_ONE_ACTIVE_STOCKIDFOR_SKU'],
    [WebApiErrorCode.PutAway_UserIsNotAssignedToStationInPutAway, 'ERRORS.PUT_AWAY.USER_IS_NOT_ASSIGNED_TO_STATION_IN_PUT_AWAY'],
    [WebApiErrorCode.PutAway_PendingMaterialinboundUnitsExceeded, 'ERRORS.PUT_AWAY.PENDING_MATERIAL_INBOUND_UNITS_EXCEEDED'],
    [WebApiErrorCode.PutAway_NoMaterialInboundAtUserStation, 'ERRORS.PUT_AWAY.NO_MATERIAL_INBOUND_AT_USER_STATION'],
    [WebApiErrorCode.PutAway_MaterialInboundIdInProgressInAnotherStation, 'ERRORS.PUT_AWAY.MATERIAL_INBOUND_IN_PROGRESS_AT_OTHER_STATION'],
    [WebApiErrorCode.PutAway_UnknownStockMultiTuLabel, 'ERRORS.PUT_AWAY.UNKNOWN_STOCKMULTITU_LABEL'],
    [WebApiErrorCode.PutAway_NoRemainingUnitsInStockMultiTu, 'ERRORS.PUT_AWAY.NO_REMAINING_UNITS_IN_STOCKMULTITU'],
    [WebApiErrorCode.PutAway_StationIsNotInDirectedPutAwayMode, 'ERRORS.PUT_AWAY.STATION_IS_NOT_IN_DIRECTED_PUTAWAY_MODE'],
    [WebApiErrorCode.PutAway_NoStockMultiTuAssignedToDirectedPutAwayInStation, 'ERRORS.PUT_AWAY.NO_STOCKMULTITU_ASSIGNED_TO_DIRECTED_PUTAWAY_IN_STATION'],
    [WebApiErrorCode.PutAway_NoMaterialInboundFoundInCurrentStockMulti, 'ERRORS.PUT_AWAY.NO_MATERIAL_INBOUND_FOUND_IN_CURRENT_STOCKMULTI'],
    [WebApiErrorCode.PutAway_NoUnitsInStockMultiTuOfMaterialInbound, 'ERRORS.PUT_AWAY.NO_UNITS_IN_STOCKMULTITU_OF_MATERIAL_INBOUND'],

    [WebApiErrorCode.Picking_InvalidPickingStationId, 'ERRORS.PICKING.INVALID_STATION_ID'],
    [WebApiErrorCode.Picking_PickingStationAlreadyAssignedToOtherUser, 'ERRORS.PICKING.STATION_ALREADY_ASSIGNED'],
    [WebApiErrorCode.Picking_ReadBinContentSkuLabelMismatch, 'ERRORS.PICKING.BIN_CONTENT_SKU_LABEL_MISMATCH'],
    [WebApiErrorCode.Picking_PickAtInactiveStationCellNum, 'ERRORS.PICKING.PICK_AT_INACTIVE_STATION'],
    [WebApiErrorCode.Picking_PickValidateWithMoreUntitsThanRequired, 'ERRORS.PICKING.PICK_VALIDATE_MORE_UNITS_THAN_REQUIRED'],
    [WebApiErrorCode.Picking_UnexpectedPickOnNotActivePutWallCell, 'ERRORS.PICKING.UNEXPECTED_PICK_ON_NOT_ACTIVE_CELL'],
    [WebApiErrorCode.Picking_StationWithPickingOperationInProgres, 'ERRORS.PICKING.STATION_WITH_PiCKING_INPROGRESS'],

    [WebApiErrorCode.ShippingTu_NoPutWallCellBatchFound, 'ERRORS.SHIPPING_TU.NO_PUT_WALL_CELL_BATCH_FOUND'],
    [WebApiErrorCode.ShippingTu_NoActiveCellToLinkTrayLabel, 'ERRORS.SHIPPING_TU.NO_ACTIVE_CELL_TO_LINK_TRAY'],
    [WebApiErrorCode.ShippingTu_NoPrintFileFound, 'ERRORS.SHIPPING_TU.NO_PRINT_FILE_FOUND'],
    [WebApiErrorCode.ShippingTu_LabelNotFound, 'ERRORS.SHIPPING_TU.LABEL_NOT_FOUND'],
    [WebApiErrorCode.ShippingTu_UnexpectedZplFileName, 'ERRORS.SHIPPING_TU.UNEXPECTED_ZLP_FILE_NAME'],
    [WebApiErrorCode.ShippingTu_PrinterNotFound, 'ERRORS.SHIPPING_TU.PRINTER_NOT_FOUND'],
    [WebApiErrorCode.ShippingTu_PrinterConnectionError, 'ERRORS.SHIPPING_TU.PRINTER_CONNECTION_ERROR'],
    [WebApiErrorCode.ShippingTu_TrayLabelLengthDoesNotMatch, 'ERRORS.SHIPPING_TU.TRAY_LABEL_LENGTH_DOES_NOT_MATCH'],
    [WebApiErrorCode.ShippingTu_PendingOrderTicketsToBePrinted, 'ERRORS.SHIPPING_TU.PENDING_ORDER_TICKETS_TO_PRINT'],
]);
