import React from "react";
import Container from "react-bootstrap/Container";

export const CourseHome = ({ course }) => {
    if (!course) {
        return "Homepage is loading...";
    }

    return (
        <Container>
            <p>Home page !!!</p>
        </Container>
    )
};
