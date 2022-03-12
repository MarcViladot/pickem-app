import React, {FC} from 'react'
import {Navigate, Route, Outlet} from "react-router-dom";
import {useAuth} from '../contexts/auth-user.context';

/*const AuthenticatedRoute = ({component: C, appProps, ...rest}) => (
        <Route
            {...rest}
            element={props => appProps.isAuthenticated
                ? <C {...props} {...appProps}/>
                : <Navigate to="/login"/>}/>
    );*/

const AuthenticatedRoute = () => {
    const {isAuthenticated} = useAuth();
    return isAuthenticated ? <Outlet/> : <Navigate to="/login"/>;
}


export default AuthenticatedRoute;
