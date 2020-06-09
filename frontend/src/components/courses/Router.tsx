import React from "react";
import {
    BrowserRouter as Router,
    Route,
    Switch,
    useParams,
} from "react-router-dom";

import { api, useBetterQuery } from "../../services/apiService";
import { PrivateRoute } from "../utils/Route";
import { MainSidebar } from "./Sidebar";
import { routes } from "../../routing/courses";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { PageNotFoundError } from "../utils/ErrorPage";
import { Course } from "../../models/courses/course";
import { Loading } from "../utils/Loading";

export const CourseRouter = ({ match }) => {
    let { courseId } = useParams<{ courseId: string }>();

    const { data: course, error, status } = useBetterQuery<Course>(
        ["course.get", courseId],
        api.courses.get
    );

    // Generate the routes
    const privateRoutes = routes(course).map(
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
    if (status === "loading") return <Loading />;
    if (status === "error") return `Une erreur est apparue: ${error}`;
    if (status === "success") {
        return (
            <Container>
                <Row>
                    <Col md={3}>
                        <MainSidebar />
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
