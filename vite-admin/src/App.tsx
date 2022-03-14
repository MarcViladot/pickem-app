import React, {useEffect, useState} from "react";
import './App.css'
import {LocalizationProvider} from '@material-ui/lab';
import AdapterDateFns from '@material-ui/lab/AdapterDateFns';
import {Routes, Route} from "react-router-dom";
import UnauthenticatedRoute from "./guards/UnauthenticatedRoute";
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import {Alert, Snackbar} from '@mui/material';
import {useSnackbar} from './contexts/snackbar.context';
import Login from './components/login/Login';
import Home from './components/home/Home';
import {useAuth} from './contexts/auth-user.context';
import {firebaseAuth} from './firebase';
import auth from './api/auth';
import LeaguesList from './components/leagues/LeaguesList';
import Dashboard from './components/dashboard/Dashboard';
import LeagueDetail from './components/leagues/LeagueDetail';
import RoundDetail from './components/rounds/RoundDetail';
import TeamsList from './components/teams/TeamsList';
import UsersList from './components/users/UsersList';
import TranslationsList from './components/translations/TranslationsList';


const App = () => {

    const [isBusy, setIsBusy] = useState(true);
    const isAuthenticated = false;
    const { snackBar, closeSnackbar, showResErrorSnackbar } = useSnackbar();
    const { authUser, setAuthUser } = useAuth();

    useEffect(() => {
        const subscriber = firebaseAuth.onAuthStateChanged((user) => {
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
            setAuthUser(res.Result);
            setIsBusy(false);
        } else {
            firebaseAuth.signOut();
            setIsBusy(false);
            showResErrorSnackbar(res);
        }
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
          {isBusy ? (
              <></>
          ) : (
              <Routes>
                  <Route path='/login' element={<UnauthenticatedRoute/>}>
                      <Route path='/login' element={<Login />}/>
                  </Route>
                  <Route path='/' element={<AuthenticatedRoute/>}>
                      <Route path='/' element={<Home />}>
                          <Route path="leagues" element={<LeaguesList />} />
                            <Route path="/leagues/:id" element={<LeagueDetail />} />
                            <Route path="/leagues/:id/round/:roundId" element={<RoundDetail />} />
                            <Route path="/teams" element={<TeamsList />} />
                            <Route path="/users" element={<UsersList />} />
                            <Route path="/translations" element={<TranslationsList />} />
                          <Route path="/" element={<Dashboard />} />
                      </Route>

                  </Route>
              </Routes>
          )}
          <Snackbar open={snackBar.open} autoHideDuration={5000} onClose={() => closeSnackbar()}>
              <Alert variant="filled" onClose={() => closeSnackbar()} severity={snackBar.variant} sx={{ width: `100%` }}>
                  {snackBar.message}
              </Alert>
          </Snackbar>
      </LocalizationProvider>
  )
}

export default App
