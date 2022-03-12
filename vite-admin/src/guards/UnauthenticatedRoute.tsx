import React, {FC} from 'react'
import {Navigate, Route, Outlet} from "react-router-dom";
import {useAuth} from '../contexts/auth-user.context';

/*const UnauthenticatedRoute = ({component: C, appProps, ...rest}) => (
    <Route
        {...rest}
        element={props => !appProps.isAuthenticated
            ? <C {...props} {...appProps} />
            : <Navigate replace to="/"/>}
    />
);*/

const UnauthenticatedRoute = () => {
    const {isAuthenticated} = useAuth();
    return !isAuthenticated ? <Outlet/> : <Navigate to="/"/>;
}

export default UnauthenticatedRoute;
