import React from 'react'
import {Redirect, Route} from "react-router-dom";

const AuthenticatedRoute = ({component: C, appProps, ...rest}) => {
    return (
        <Route
            {...rest}
            render={props => appProps.isAuthenticated
            ? <C {...props} {...appProps}/>
            : <Redirect to="/login"/>}/>
    );
};

export default AuthenticatedRoute;
