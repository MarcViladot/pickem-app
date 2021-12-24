import React, {useEffect, useState} from "react";
import "./App.css";
import UnauthenticatedRoute from "./guards/UnauthenticatedRoute";
import {Switch} from "react-router-dom";
import Login from "./components/auth/Login";
import Home from "./components/home/Home";
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "./reducers";
import auth from "./api/auth";
import {setUser} from "./actions/auth/setUser";
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import {firebaseAuth} from './firebase';
import {Alert, Snackbar} from '@mui/material';
import {hideSnackbar} from './actions/utils/hideSnackbar';
import {showResErrorSnackbar} from './actions/utils/showSnackbar';

const App = () => {

    const dispatch = useDispatch();
    const [isBusy, setIsBusy] = useState(true);
    const isAuthenticated = useSelector((state: RootState) => state.user.isLoggedIn);
    const snackbarConfig = useSelector((state: RootState) => state.utils.snackbarConfig);

    useEffect(() => {
        const subscriber = firebaseAuth.onAuthStateChanged((user) => {
            // console.log(`login state change: ${!!user ? 'logged' : 'not logged'}`);
            if (user && !isAuthenticated) {
                getCurrentUserAdmin();
            } else {
                setIsBusy(false);
            }
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    const getCurrentUserAdmin = async () => {
        const res = await auth.getCurrentUserAdmin();
        if (!res.IsError && !!res.Result) {
            await firebaseAuth.signInWithCustomToken(res.Result.token);
            dispatch(setUser(res.Result));
            setIsBusy(false);
        } else {
            firebaseAuth.signOut();
            setIsBusy(false);
            dispatch(showResErrorSnackbar(res));
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
            <Snackbar open={snackbarConfig.open} autoHideDuration={5000} onClose={() => dispatch(hideSnackbar())}>
                <Alert variant="filled" onClose={() => dispatch(hideSnackbar())}
                       severity={snackbarConfig.variant} sx={{width: '100%'}}>
                    {snackbarConfig.message}
                </Alert>
            </Snackbar>
        </LocalizationProvider>
    );
};

export default App;
