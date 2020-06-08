import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
} from "react-router-dom";

import { api, useBetterQuery } from "../../services/apiService";
import { PrivateRoute } from "../utils/Route";
import { routes } from "../../routing/associations";
import { ErrorMessage, PageNotFoundError } from "../utils/ErrorPage";
import { Association } from "../../models/associations/association";
import { AssociationLayout } from "./Layout";
import { Loading } from "../utils/Loading";

export const AssociationRouter = ({ match }) => {
    const { associationId } = useParams<{ associationId: string }>();

    const { data: association, error, status } = useBetterQuery<Association>(
        ["association.get", associationId],
        api.associations.get,
        {
            refetchOnWindowFocus: false,
        }
    );

    if (association === undefined) {
        return null;
    }

    // Render
    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>`Une erreur est apparue: ${error}`</ErrorMessage>
    ) : status === "success" ? (
        <Router>
            <Switch>
                {privateRoutes(association, match)}
                <Route component={PageNotFoundError} />
            </Switch>
        </Router>
    ) : null;
};

// Generate the routes
const privateRoutes = (association, match) =>
    association
        ? routes(association).map(
              ({
                  path,
                  component: Component,
                  exact,
                  props,
                  defaultLayout = false,
              }) => {
                  const renderedComponent = defaultLayout
                      ? ({ association, ...props }) => (
                            <AssociationLayout association={association}>
                                {
                                    <Component
                                        association={association}
                                        {...props}
                                    />
                                }
                            </AssociationLayout>
                        )
                      : Component;

                  return (
                      <PrivateRoute
                          exact={exact}
                          path={match.url + path} // Path is the relative path, match.url makes it absolute
                          component={renderedComponent}
                          key={path}
                          routeProps={props}
                      />
                  );
              }
          )
        : [];
