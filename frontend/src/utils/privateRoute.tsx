import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../App";

/**
 * Ensures the user is logged-in before displaying them the route
 */
export const PrivateRoute = ({ component: Component, ...rest }) => {
    return <Route
        {...rest}
        render={props =>
            authService.isAuthenticated ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { from: props.location }
                    }}
                />
            )
        }
    />
};
