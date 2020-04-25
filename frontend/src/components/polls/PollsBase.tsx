import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsSidebar } from "./PollsSidebar";
import Container from "react-bootstrap/Container";

type Props = {
    title: any;
    children: any;
};

export function PollsBase(props: Props) {
    return (
        <Container className="mt-3">
            <Row>
                <Col xs={{ offset: 2 }}>{props.title}</Col>
            </Row>

            <Row>
                <Col xs={2}>
                    <PollsSidebar />
                </Col>
                <Col>{props.children}</Col>
            </Row>
        </Container>
    );
}
