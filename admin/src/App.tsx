import React, { useEffect, useState } from "react";
import "./App.css";
import UnauthenticatedRoute from "./guards/UnauthenticatedRoute";
import { Switch } from "react-router-dom";
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./reducers";
import auth from "./api/auth";
import { ResponseApi } from "./utils/IResponse";
import { User } from "./interfaces/User";
import { setUser } from "./actions/auth/setUser";
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {loadTeams} from './actions/teams/loadTeams';



const App = () => {
  const dispatch = useDispatch();
  const [isBusy, setIsBusy] = useState(true);
  const hasToken = useSelector((state: RootState) => state.user.hasToken);
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isLoggedIn
  );

  useEffect(() => {
    if (hasToken) {
      tryLogin();
    } else {
      setIsBusy(false);
    }
  }, []);

  const tryLogin = async () => {
    const res = (await auth.autoLogin());
    if (!res.IsError) {
      if (res.Result) {
        dispatch(setUser(res.Result));
      }
      setIsBusy(false);
    } else {
      // TODO SHOW ERROR
      setIsBusy(false);
    }
  };

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
      {isBusy ? (
        <></>
      ) : (
        <Switch>
          <UnauthenticatedRoute
            path="/login"
            component={Login}
            appProps={{
              isAuthenticated,
            }}
          />
          <AuthenticatedRoute
            path="/"
            component={Home}
            appProps={{
              isAuthenticated,
            }}
          />
        </Switch>
      )}
      </LocalizationProvider>
  );
};

export default App;
