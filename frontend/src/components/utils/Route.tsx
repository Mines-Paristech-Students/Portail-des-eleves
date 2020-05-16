import React from "react";
import { Route, Redirect } from "react-router-dom";
import { authService } from "../../App";
import Navbar from "../Navbar";
import { AuthProvider } from "../../services/authService";

/**
 * Ensure the user is logged-in before displaying them the route
 */
export const PrivateRoute = ({
    component: Component,
    routeProps = {},
    ...rest
}) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                authService.isAuthenticated ? (
                    <Component {...props} {...routeProps} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location },
                        }}
                    />
                )
            }
        />
    );
};

export const CommonPrivateRoute = ({ component: Component, ...rest }) => (
    <PrivateRoute
        {...rest}
        component={(props) => (
            <AuthProvider>
                <Navbar />
                <Component {...props} />
            </AuthProvider>
        )}
    />
);
