import React from 'react'
import {Redirect, Route} from "react-router-dom";

const UnauthenticatedRoute = ({ component: C, appProps, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => !appProps.isAuthenticated
          ? <C {...props} {...appProps} />
          : <Redirect to="/" />}
    />
  )
};

export default UnauthenticatedRoute;
