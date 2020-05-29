
import React, { useState, useEffect, useContext } from "react";
import { PageTitle } from "../../../components/utils/PageTitle";
import { api, useBetterQuery, PaginatedResponse } from "../../../services/apiService";
import { Card, Container, Row, Accordion, Col, Carousel } from "react-bootstrap";
import { QuestionCategory, Question } from "../../../models/courses/question";
import { StatsQuestion, Comment } from "../../../models/courses/requests";
import { ColumnChart } from 'react-chartkick';
import { ToastContext, ToastLevel } from "../../../components/utils/Toast";
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
    const PAGE_SIZE = 5;
    const AUTO_FETCH_DIFF = 2;

    const newToast = useContext(ToastContext);
    const [index, setIndex] = useState<number>(0);
    const [next, setNext] = useState<number | null>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [comments, setComments] = useState<string[]>([])

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    useEffect(() => {
        if (isFetching || !next) return;

        if (Math.abs(next % PAGE_SIZE) > 1) return;

        api.courses
            .commentsPage(course.id, question.id, next, PAGE_SIZE)
            .then((page: PaginatedResponse<Comment[]>) => {
                disectPaginatedResponse(page);
                setIsFetching(false);
            })
            .catch(err => {
                newToast({
                    message: "Could not fetch next message",
                    level: ToastLevel.Error,
                })
            })
    }, [index])

    const disectPaginatedResponse = (page: PaginatedResponse<Comment[]>) => {
        if (!page.next) setNext(null);
        else {
            const url = new URL(page.next);
            const next = url.searchParams.get("next");
            if (next) setNext(Number(next));
            else setNext(null);
        }

        let copy = comments.slice();
        copy = copy.concat(page.results.map(comment => comment.content));
        setComments(copy);
    }

    return (
        <Col md={8} key={question.id}>
            <Card>
                <Card.Title>
                    {question.label}
                </Card.Title>
                <Card.Body>
                    <Carousel 
                        as={Row}
                        activeIndex={index}
                        onSelect={handleSelect} 
                        interval={null}
                        nextIcon={<span aria-hidden="true" className="fe fe-right-circle" />}
                        prevIcon={<span aria-hidden="true" className="fe fe-left-circle" />}
                    >
                        {comments.map(comment => 
                            <Carousel.Item className="overflow-auto">
                                <p>{comment}</p>
                            </Carousel.Item>    
                        )}
                    </Carousel>
                </Card.Body>
            </Card>
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
                    .filter(question => question.category == QuestionCategory.Comment)
                    .map(question => <PaginatedCardComment question={question} course={course} />)
                }
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