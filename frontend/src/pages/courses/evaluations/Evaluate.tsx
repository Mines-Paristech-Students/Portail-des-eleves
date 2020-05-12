import React from "react";
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Question } from "../../../models/courses/question"
import { Course } from "../../../models/courses/course";

export const EvaluateCourse = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        "courses.questions",
        api.courses.questions,
        course.id,
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    else if (status === "error") {
        return `Something went wrong: ${error}`;
    } else if (status === "success" && questions) {
        return (
            <Container>
                <PageTitle>Cours</PageTitle>
                <Row>
                    {questions.map(question => (
                        <QuestionCard question={question} />
                    ))}
                </Row>
            </Container>
        );
    }

    return null;
};

export const QuestionCard = ({ question}) => {
    return (
        <Card key={question.id} className={"col-md-3 m-4"}>
            <Link to={`/cours/${question.id}/`}>
                <Card.Body>
                    <Card.Title>{question.label}</Card.Title>
                </Card.Body>
            </Link>
        </Card>
    )
};