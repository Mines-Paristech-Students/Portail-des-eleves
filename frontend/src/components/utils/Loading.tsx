import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

/**
 * Display a (somewhat) centered `Spinner`.
 * @param className given to the `Container` element.
 * @param children the react children
 */
export const Loading = ({
    className = "",
    children,
}: {
    className?: string;
    children?: any;
}) => (
    <Container className={className}>
        <Row className="justify-content-center">
            <Col xs="1">
                <Spinner animation="border" role="status" />
                {children}
            </Col>
        </Row>
    </Container>
);
