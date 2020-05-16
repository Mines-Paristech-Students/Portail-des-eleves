import React from "react";
import { CardStatus } from "../../utils/CardStatus";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { User } from "../../../models/user";
import { TablerColor } from "../../../utils/colors";

export const UserProfileQuestions = ({ user }: { user: User }) => (
    <Card>
        <CardStatus position="left" color={TablerColor.Blue} />
        <Card.Header>
            <Card.Title>Questions et réponses</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            <Row className="mb-3">
                <Col className="font-weight-bold" md={5}>
                    Ta devise ?
                </Col>
                <Col md={7}>Too much is not enough</Col>
            </Row>
            <Row className="mb-3">
                <Col className="font-weight-bold" md={5}>
                    Tes hobbies ?
                </Col>
                <Col md={7}>Critiquer les Mines</Col>
            </Row>
            <Row className="mb-3">
                <Col className="font-weight-bold" md={5}>
                    Tes sports ?
                </Col>
                <Col md={7}>Le claquage</Col>
            </Row>
        </Card.Body>
    </Card>
);
