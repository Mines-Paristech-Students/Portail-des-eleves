import Card from "react-bootstrap/Card";
import React from "react";
import { Link } from "react-router-dom";
import { CardStatus } from "../../utils/CardStatus";

export const PollNoPolls = () => (
    <Card className="mx-auto">
        <CardStatus color="red" />

        <Card.Header>
            <Card.Title as="h3">Pas de sondage !</Card.Title>
        </Card.Header>

        <Card.Body>
            <Link
                to="/sondages/proposer"
                className="selectgroup-button text-decoration-none"
            >
                C’est terrible, je vais de ce pas en proposer un !
            </Link>
            <Link
                to="/sondages/proposer"
                className="selectgroup-button text-decoration-none"
            >
                OK, laissez-moi faire le boulot du VP geek à sa place…
            </Link>
        </Card.Body>
    </Card>
);
