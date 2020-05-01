import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PollsSidebar } from "./PollsSidebar";
import Container from "react-bootstrap/Container";

export const PollsBase = ({ children }: { children: any }) => (
    <Container className="mt-5">
        <Row>
            <Col md="3">
                <PollsSidebar isAdmin />
            </Col>
            <Col md="9">{children}</Col>
        </Row>
    </Container>
);
