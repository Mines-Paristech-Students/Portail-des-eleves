
import React from "react";
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Card, Container, Row, Accordion, Col } from "react-bootstrap";
import { QuestionCategory, Question } from "../../../models/courses/question";
import { StatsQuestion } from "../../../models/courses/requests";
import { ColumnChart } from 'react-chartkick'
import 'chart.js';

const DigitToStar = (num: number) => {
    let ceil = Math.ceil(num);
    let floor = Math.floor(num);

    let result: string = "★".repeat(floor);
    let floating = ceil - num;

    if (floating > 0.75) {
        result += "★";
    } else if (floating > 0.25) {
        result += "⭑";
    }

    return result;
}

const StatsCardQuestion = ({ statsQuestion }) => {
    return (
        <Col md={8} key={statsQuestion.id}>
            <Accordion>
                <Card className="text-center" >
                    <Accordion.Toggle as={Card.Body} eventKey="0">
                        <Card.Title>{statsQuestion.label}</Card.Title>
                        <Card.Subtitle>{DigitToStar(Number(statsQuestion.average))}</Card.Subtitle>
                        <Card.Text>
                            Histograme <i className="fe fe-arrow-down" />
                        </Card.Text>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Footer>
                            <ColumnChart data={statsQuestion.histogram} stacked={true} />
                        </Card.Footer>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Col>
    )
}

const StatsCourse = ({ course }) => {
    const { data: stats, error, status } = useBetterQuery<StatsQuestion[]>(
        "courses.stats",
        api.courses.stats,
        course.id,
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    if (status === "error") return <p>{`Something went wrong: ${error}`}</p>;

    if (status === "success" && stats) {
        return (
            <Row>
                {stats.map(statsQuestion => (
                    <StatsCardQuestion statsQuestion={statsQuestion} />
                ))}
            </Row>
        );
    }

    return null;
};

export const PaginatedCardComment = ({ question, course }) => {
    console.log(question)
    return (
        <Col md={8} key={question.id}>
            <Card>
                <Card.Title>
                    {question.category}
                </Card.Title></Card>
        </Col>
    )
}

const PaginatedComments = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        "courses.forms.question.list",
        api.courses.forms.questions.list,
        course.form,
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    if (status === "error") return <p>{`Something went wrong: ${error}`}</p>;

    if (status === "success" && questions) {
        return (
            <Row>
                {questions
                    .map(question =>
                        <PaginatedCardComment question={question} course={course} />
                    )}
            </Row>
        );
    }

    return null;
}

export const ResultsCourse = ({ course }) => (
    <Container>
        <PageTitle>{course.name}</PageTitle>

        <PaginatedComments course={course} />

        <StatsCourse course={course} />
    </Container>
)