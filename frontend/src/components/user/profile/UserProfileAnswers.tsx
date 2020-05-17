import React from "react";
import { CardStatus } from "../../utils/CardStatus";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { User } from "../../../models/user/user";
import { TablerColor } from "../../../utils/colors";
import { ProfileAnswer } from "../../../models/user/profile";

const UserProfileAnswer = ({
    profileAnswer,
}: {
    profileAnswer: ProfileAnswer;
}) => (
    <Row className="mb-3">
        <Col className="font-weight-bold" md={5}>
            {profileAnswer.question}
        </Col>
        <Col md={7}>{profileAnswer.text}</Col>
    </Row>
);

export const UserProfileAnswers = ({ user }: { user: User }) => (
    <Card>
        <CardStatus position="left" color={TablerColor.Blue} />
        <Card.Header>
            <Card.Title>Questions et réponses</Card.Title>
        </Card.Header>
        <Card.Body className="px-7">
            {
                user.profileAnswers.length > 0 ?
                    <>{user.profileAnswers
                .sort((answerA, answerB) => answerA.question.localeCompare(answerB.question) )
                .map((answer) => (
                    <UserProfileAnswer profileAnswer={answer} key={answer.id}/>
                ))}</>
                    : <p className="text-center">Rien ici 😭😭😭</p>
            }

        </Card.Body>
    </Card>
);
