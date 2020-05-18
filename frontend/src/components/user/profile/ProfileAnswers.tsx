import React from "react";
import { CardStatus } from "../../utils/CardStatus";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { TablerColor } from "../../../utils/colors";
import {Profile, ProfileAnswer} from "../../../models/profile";

const NoContent = () => (
    <p className="text-center">
        Rien ici{" "}
        <span role="img" aria-label="Visage qui pleure à chaudes larmes">
            😭
        </span>
    </p>
);

export const ProfileAnswers = ({ profile }: { profile: Profile }) => (
    <Card>
        <CardStatus position="left" color={TablerColor.Blue} />
        <Card.Header>
            <Card.Title>Questions et réponses</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            {profile.profileAnswers.length > 0 ? (
                <>
                    {profile.profileAnswers
                        .sort((answerA, answerB) =>
                            answerA.question.localeCompare(answerB.question)
                        )
                        .map((answer: ProfileAnswer) => (
                            <Row className="mb-3" key={answer.id}>
                                <Col className="font-weight-bold" md={5}>
                                    {answer.question}
                                </Col>
                                <Col md={7}>{answer.text}</Col>
                            </Row>
                        ))}
                </>
            ) : (
                <NoContent />
            )}
        </Card.Body>
    </Card>
);
