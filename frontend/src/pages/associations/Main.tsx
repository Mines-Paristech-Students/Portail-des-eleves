import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams
} from "react-router-dom";

import { api, useBetterQuery } from "../../services/apiService";
import { PrivateRoute } from "../../utils/route";
import { AssociationSidebar } from "./Sidebar";
import { routes } from "../../routing/associations";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { PageNotFoundError } from "../ErrorPage";
import { Association } from "../../models/associations/association";

export const AssociationMain = ({ match }) => {
    let { associationId } = useParams<{ associationId: string }>();

    const { data: association, error, status } = useBetterQuery<Association>(
        "association.get",
        api.associations.get,
        associationId
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
    if (status === "loading") return "Chargement en cours...";
    if (status === "error") return `Une erreur est apparue: ${error}`;
    if (status === "success") {
        return (
            <Container>
                <Row>
                    <Col md={3}>
                        <AssociationSidebar association={association} />
                    </Col>
                    <Col md={9}>
                        <Router>
                            <Switch>
                                {privateRoutes}
                                <Route component={PageNotFoundError} />
                            </Switch>
                        </Router>
                    </Col>
                </Row>
            </Container>
        );
    }

    return null;
};
