import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../App";
import Navbar from "./navbar";

/**
 * Ensure the user is logged-in before displaying them the route
 */
export const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
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
);

export const CommonPrivateRoute = ({ component: Component, ...rest }) => (
    <PrivateRoute
        {...rest}
        component={props => (
            <>
                <Navbar />
                <Component {...props} />
            </>
        )}
    />
);
