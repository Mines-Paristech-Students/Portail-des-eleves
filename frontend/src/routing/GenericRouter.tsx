import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageNotFoundError } from "../components/utils/ErrorPage";
import { PrivateRoute } from "../components/utils/Route";
import React from "react";

export const GenericRouter = ({ match, routes }) => (
    <Router>
        <Switch>
            {routes.map(({ path, component: Component, exact }) => (
                <PrivateRoute
                    exact={exact}
                    path={match.url + path} // Path is the relative path, match.url makes it absolute
                    component={Component}
                    key={path}
                />
            ))}
            <Route component={PageNotFoundError} />
        </Switch>
    </Router>
);
