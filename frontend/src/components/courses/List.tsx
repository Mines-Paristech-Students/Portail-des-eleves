import React from "react";
import { PageTitle } from "../../utils/common";
import { api, useBetterQuery } from "../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Course } from "../../models/courses/course";

export const CourseList = () => {
    const { data: courses, error, status } = useBetterQuery<Course[]>(
        "courses.list",
        api.courses.list
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    else if (status === "error") {
        return `Something went wrong: ${error}`;
    } else if (status === "success" && courses) {
        return (
            <Container>
                <PageTitle>Cours</PageTitle>
                <Row>
                    {courses.map(course => (
                        <Card key={course.id} className={"col-md-3 m-4"}>
                            <Link to={`/cours/${course.id}/`}>
                                <Card.Body>
                                    <Card.Title>{course.name}</Card.Title>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                </Row>
            </Container>
        );
    }

    return null;
};
