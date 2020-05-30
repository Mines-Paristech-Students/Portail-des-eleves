import React from "react";
import { PageTitle } from "../utils/PageTitle";
import { api } from "../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Pagination } from "../utils/Pagination"; 

export const CourseList = () => (
    <Container>
        <PageTitle>Cours</PageTitle>
        <Pagination
            apiKey={["api.courses.list"]}
            apiMethod={api.courses.list}
            render={
                (courses, paginationControl) => (
                    <>
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
                        {paginationControl}
                    </>
                )}
        />
    </Container>
);