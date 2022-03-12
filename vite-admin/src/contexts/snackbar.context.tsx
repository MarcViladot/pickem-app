import React, { createContext, useContext, useState } from "react";
import { AlertColor } from "@mui/material";
import {ErrorTools} from '../utils/ErrorTools';
import {ResponseApiError, WebApiErrorCode} from '../utils/IResponse';

interface SnackBarConfig {
  open: boolean;
  message: string;
  variant: AlertColor | undefined;
}

interface SnackBarContext {
  snackBar: SnackBarConfig;
  closeSnackbar?: () => void;
  showResErrorSnackbar?: (res: ResponseApiError) => void;
  showSuccessSnackbar?: (message: string) => void;
  showErrorSnackbar?: (message: string) => void;
}

const SnackbarContext = createContext<SnackBarContext>({
  snackBar: {
    open: false,
    message: ``,
    variant: undefined,
  },
});

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: ``,
    variant: undefined,
  });

  const showSnackbar = (message: string, variant: AlertColor) => {
    setSnackBar({
      open: true,
      message,
      variant,
    });
  };

  const closeSnackbar = () => {
    setSnackBar({ open: false, message: ``, variant: `warning` });
  };

  const showResErrorSnackbar = (res: ResponseApiError) => {
    if (res.ErrorCode === WebApiErrorCode.FirebaseError) {
      showSnackbar(res.ErrorDetail, `error`);
    }
    const message = ErrorTools.getApiErrorMsgFromResponse(res);
    return showSnackbar(message, `error`);
  };

  const showSuccessSnackbar = (message: string) => {
    return showSnackbar(message, `success`);
  };

  const showErrorSnackbar = (message: string) => {
    return showSnackbar(message, 'error');
  };

  return <SnackbarContext.Provider value={{ snackBar,  closeSnackbar, showResErrorSnackbar, showSuccessSnackbar, showErrorSnackbar }}>{children}</SnackbarContext.Provider>;
}

export const useSnackbar = () => useContext(SnackbarContext);
