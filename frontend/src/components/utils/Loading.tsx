import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

/**
 * Display a (somewhat) centered `Spinner`.
 * @param className given to the `Container` element.
 */
export const Loading = ({ className = "" }: { className?: string }) => (
    <Container className={className}>
        <Row className="justify-content-center">
            <Col xs="1">
                <Spinner animation="border" role="status" />
            </Col>
        </Row>
    </Container>
);
