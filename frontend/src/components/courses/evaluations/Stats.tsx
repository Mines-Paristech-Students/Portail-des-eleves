import React from "react";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import {
    Card,
    Container,
    Row,
    Accordion,
    Col,
    ProgressBar,
} from "react-bootstrap";
import { QuestionCategory, Question } from "../../../models/courses/question";
import { StatsQuestion, Histogram } from "../../../models/courses/requests";
import { PaginatedModalComment } from "./PaginatedModalComment";
import { Loading } from "../../utils/Loading";

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
};

const DictToHistogram = (histogram: Histogram) => {
    let sum = 0;
    Object.keys(histogram)
        .map((e) => parseInt(e))
        .forEach((key) => {
            sum += histogram[key];
        });

    return (
        <Col>
            {Object.keys(histogram)
                .sort()
                .reverse()
                .map((key) => (
                    <Row>
                        <Col sm={1}>
                            <p>{key}</p>
                        </Col>
                        <Col sm={10}>
                            <ProgressBar
                                now={(histogram[key] / sum) * 100}
                                key={"hist" + key}
                                label={key}
                                srOnly
                            />
                        </Col>
                    </Row>
                ))}
        </Col>
    );
};

const StatsCardQuestion = ({ statsQuestion }) => {
    return (
        <Col md={8} key={statsQuestion.id}>
            <Accordion>
                <Card className="text-center">
                    <Accordion.Toggle as={Card.Body} eventKey="0">
                        <Card.Title>{statsQuestion.label}</Card.Title>
                        <Card.Subtitle>
                            {DigitToStar(Number(statsQuestion.average))}
                        </Card.Subtitle>
                        <Card.Text>
                            Histograme <i className="fe fe-arrow-down" />
                        </Card.Text>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Footer>
                            {DictToHistogram(statsQuestion.histogram)}
                        </Card.Footer>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Col>
    );
};

const StatsCourse = ({ course }) => {
    const { data: stats, error, status } = useBetterQuery<StatsQuestion[]>(
        ["courses.stats", course.id],
        api.courses.stats
    );

    if (status === "loading") return <Loading />;
    if (status === "error") return <p>{`Something went wrong: ${error}`}</p>;

    if (status === "success" && stats) {
        return (
            <Row>
                {stats.map((statsQuestion) => (
                    <StatsCardQuestion statsQuestion={statsQuestion} />
                ))}
            </Row>
        );
    }

    return null;
};

export const PaginatedCardComment = ({ question, course }) => (
    <Col md={8} key={question.id}>
        <Card className="text-center">
            <Card.Body>
                <Card.Title>{question.label}</Card.Title>
            </Card.Body>

            <PaginatedModalComment question={question} course={course} />
        </Card>
    </Col>
);

const PaginatedComments = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        ["courses.forms.question.list", course.form],
        api.courses.forms.questions.list
    );

    if (status === "loading") return <Loading />;

    if (status === "error") return <p>{`Something went wrong: ${error}`}</p>;

    if (status === "success" && questions) {
        return (
            <Row>
                {questions
                    .filter(
                        (question) =>
                            question.category === QuestionCategory.Comment
                    )
                    .map((question) => (
                        <PaginatedCardComment
                            question={question}
                            course={course}
                        />
                    ))}
            </Row>
        );
    }

    return null;
};

export const ResultsCourse = ({ course }) => (
    <Container>
        <PageTitle>{course.name}</PageTitle>

        <PaginatedComments course={course} />

        <StatsCourse course={course} />
    </Container>
);
