import React, {Suspense} from "react";
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import {createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import {QueryClient, QueryClientProvider} from 'react-query';
import {BrowserRouter as Router} from "react-router-dom";
import {AuthUserProvider} from "./contexts/auth-user.context";
import {SnackbarProvider} from './contexts/snackbar.context';


const darkTheme = createTheme({
    palette: {
        mode: `dark`,
    },
});

const Loader = () => <div>loading...</div>;

const twentyFourHoursInMs = 1000 * 60 * 60 * 24;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
            refetchOnMount: false,
            retry: false,
            staleTime: twentyFourHoursInMs,
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <AuthUserProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline/>
                    <Router>
                        <SnackbarProvider>
                            <Suspense fallback={<Loader/>}>
                                <App/>
                            </Suspense>
                        </SnackbarProvider>
                    </Router>
                </ThemeProvider>
            </QueryClientProvider>
        </AuthUserProvider>
    </React.StrictMode>, document.getElementById('root')
)
