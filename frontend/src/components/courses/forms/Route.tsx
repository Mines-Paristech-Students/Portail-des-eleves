import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { MainSidebar } from "./../Sidebar";
import { routes } from "../../../routing/forms";
import { PrivateRoute } from "../../utils/Route";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PageNotFoundError } from "../../utils/ErrorPage";

export const FormRouter = ({ match }) => {
    // Generate the routes
    const formRoutes = routes().map(({ path, component, exact }) => (
        <PrivateRoute
            exact={exact}
            path={match.url + path} // Path is the relative path, match.url makes it absolute
            component={component}
            key={path}
        />
    ));

    // Render
    return (
        <Container>
            <Row>
                <Col md={3}>
                    <MainSidebar />
                </Col>
                <Col md={9}>
                    <Router>
                        <Switch>
                            {formRoutes}
                            <Route component={PageNotFoundError} />
                        </Switch>
                    </Router>
                </Col>
            </Row>
        </Container>
    );
};
