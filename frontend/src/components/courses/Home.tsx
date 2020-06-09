import React from "react";
import Container from "react-bootstrap/Container";
import { Loading } from "../utils/Loading";
import { ResultsCourse } from "./evaluations/Stats";

export const CourseHome = ({ course }) => {
    if (!course) {
        return <Loading />;
    }

    return (
        <Container>
                <ResultsCourse course={course} />
        </Container>
    );
};
