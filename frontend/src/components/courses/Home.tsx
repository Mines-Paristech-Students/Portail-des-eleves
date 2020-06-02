import React from "react";
import Container from "react-bootstrap/Container";
import { Loading } from "../utils/Loading";

export const CourseHome = ({ course }) => {
    if (!course) {
        return <Loading />;
    }

    return (
        <Container>
            <p>Home page !!!</p>
        </Container>
    );
};
