import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams
} from "react-router-dom";

import { api } from "../../services/apiService";
import { PrivateRoute } from "../../utils/route";
import { AssociationSidebar } from "./sidebar";
import { routes } from "../../routing/associations";
import { PageNotFoundError } from "../errorPage";
import { useQuery } from "react-query";

export const AssociationMain = ({ match }) => {
    // Load the data
    const { associationId } = useParams();

    const { data: association, isLoading, error } = useQuery(
        ["associations.get", { associationId }],
        api.associations.get
    );

    // Generate the routes
    const privateRoutes = routes(association).map(
        ({ path, component, exact, props }) => (
            <PrivateRoute
                exact={exact}
                path={match.url + path} // Path is the relative path, match.url makes it absolute
                component={component}
                key={path}
                routeProps={props}
            />
        )
    );

    // Render
    if (isLoading) return "Loading association container...";
    if (error) return `Something went wrong: ${error.message}`;
    if (association) {
        return (
            <div className={"container"}>
                <div className="row">
                    <div className="col-md-3">
                        <AssociationSidebar association={association} />
                    </div>
                    <div className="col-md-9">
                        <Router>
                            <Switch>
                                {privateRoutes}
                                <Route component={PageNotFoundError} />
                            </Switch>
                        </Router>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
