
import React from "react";
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Card, Container, Row, Accordion, Col } from "react-bootstrap";
import { StatsQuestion } from "../../../models/courses/requests";
import { ColumnChart } from 'react-chartkick'
import 'chart.js';

export const DigitToStar = (num: number) => {
    let ceil = Math.ceil(num);
    let floor = Math.floor(num);

    let result: string = "★".repeat(floor);
    let floating = ceil-num;

    if (floating > 0.75) {
        result += "★";
    } else if (floating > 0.25) {
        result += "⭑";
    }

    return result;
}

export const StatsCardQuestion = ({ stats }) => {
    return (
        <Col md={8} key={stats.id}>
            <Accordion>
                <Card className="text-center" >
                    <Accordion.Toggle as={Card.Body} eventKey="0">
                        <Card.Title>{stats.label}</Card.Title>
                        <Card.Subtitle>{DigitToStar(Number(stats.average))}</Card.Subtitle>
                        <Card.Text>
                            Histograme <i className="fe fe-arrow-down" />
                        </Card.Text>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                        <Card.Footer>
                            <ColumnChart data={stats.histogram} stacked={true} />
                        </Card.Footer>
                    </Accordion.Collapse>
                </Card>
            </Accordion>
        </Col>
    )
}

export const StatsCourse = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<StatsQuestion[]>(
        "courses.stats",
        api.courses.stats,
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
                    {questions.map(question =>
                        <StatsCardQuestion stats={question} />
                    )}
                </Row>
            </Container>
        );
    }

    return null;
};