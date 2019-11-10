import React from 'react';
import {Poll} from "../../../models/polls";
import "./list_published_polls.css";
import {dateFormatter} from "../../../utils/date";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";

type Props = {
    poll: Poll,
};

export function InactivePoll(props: Props) {
    let totalVotes = 0;
    props.poll.choices.forEach(choice => totalVotes = choice.numberOfVotes ? totalVotes + choice.numberOfVotes : totalVotes);

    function getColor(numberOfVotes: number, totalVotes: number): string {
        if (numberOfVotes > totalVotes / 2) {
            return "success";
        } else if (numberOfVotes > totalVotes / 3) {
            return "warning";
        }

        return "danger";
    }

    return (
        <Card>
            <Card.Header>
                <Card.Title>{props.poll.question}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>{dateFormatter(props.poll.publicationDate)}</em>
                </Card.Subtitle>

                <ListGroup>
                    {props.poll.choices.map(
                        choice => {
                            if (choice.numberOfVotes) {
                                return (
                                    <ListGroup.Item key={choice.id}>
                                        <h5>{choice.text}</h5>
                                        <ProgressBar
                                            now={choice.numberOfVotes}
                                            min={0}
                                            max={totalVotes}
                                            color={getColor(choice.numberOfVotes, totalVotes)}>
                                            {choice.numberOfVotes}
                                        </ProgressBar>
                                    </ListGroup.Item>
                                );
                            } else {
                                return <></>;
                            }
                        }
                    )}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}
