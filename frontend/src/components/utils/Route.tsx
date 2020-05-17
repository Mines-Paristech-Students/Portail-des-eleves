import React from "react";
import { Route, Redirect } from "react-router-dom";
import { userService } from "../../App";
import Navbar from "../Navbar";
import { UserProvider } from "../../services/userService";

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
                userService.isAuthenticated ? (
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
            <UserProvider>
                <Navbar />
                <Component {...props} />
            </UserProvider>
        )}
    />
);
