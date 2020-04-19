import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsSidebar } from "./PollsSidebar";
import Container from "react-bootstrap/Container";

type Props = {
    children: any;
};

export function PollsBase(props: Props) {
    return (
        <Container className="mt-5">
            <Row>
                <Col md="3">
                    <PollsSidebar adminVersion />
                </Col>
                <Col md="9">{props.children}</Col>
            </Row>
        </Container>
    );
}
