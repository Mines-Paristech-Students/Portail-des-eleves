import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams
} from "react-router-dom";

import { api } from "../../services/apiService";
import { PrivateRoute } from "../../utils/route";
import { AssociationSidebar } from "./Sidebar";
import { routes } from "../../routing/associations";
import { useQuery } from "react-query";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { PageNotFoundError } from "../ErrorPage";
import { Association } from "../../models/associations/association";

export const AssociationMain = ({ match }) => {
    // Load the data
    const { associationId } = useParams();

    const { data: association, isLoading, error } = useQuery<Association, any>(
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
    if (isLoading) return "Chargement en cours...";
    if (error) return `Une erreur est apparue: ${error.message}`;
    if (association) {
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
