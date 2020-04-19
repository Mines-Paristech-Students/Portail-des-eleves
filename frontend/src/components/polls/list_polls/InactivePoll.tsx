import React from "react";
import { Poll } from "../../../models/polls";
import "./list_polls.css";
import { dateFormatter } from "../../../utils/format";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";

type Props = {
    poll: Poll;
};

export function InactivePoll(props: Props) {
    let totalVotes = 0;
    props.poll.choices.forEach(
        choice =>
            (totalVotes = choice.numberOfVotes
                ? totalVotes + choice.numberOfVotes
                : totalVotes)
    );

    function getColor(
        numberOfVotes: number,
        totalVotes: number
    ): "success" | "warning" | "danger" {
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
                <Card.Title as="h3">{props.poll.question}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>
                        {props.poll.publicationDate &&
                            dateFormatter(props.poll.publicationDate)}
                    </em>
                </Card.Subtitle>

                <ListGroup>
                    {props.poll.choices
                        // Sort by descending number of votes.
                        .sort(
                            (a, b) =>
                                Number(b.numberOfVotes) -
                                Number(a.numberOfVotes)
                        )
                        .map(choice => {
                            if (choice.numberOfVotes) {
                                return (
                                    <ListGroup.Item
                                        key={choice.id}
                                        className="border-0"
                                    >
                                        <div className="clearfix">
                                            <div className="float-left">
                                                <strong>{choice.text}</strong>
                                            </div>
                                            <div className="float-right text-muted">
                                                <small>
                                                    {choice.numberOfVotes} votes
                                                </small>
                                            </div>
                                        </div>
                                        <ProgressBar
                                            className="progress-sm"
                                            now={choice.numberOfVotes}
                                            min={0}
                                            max={totalVotes}
                                            variant={getColor(
                                                choice.numberOfVotes,
                                                totalVotes
                                            )}
                                        />
                                    </ListGroup.Item>
                                );
                            } else {
                                return <></>;
                            }
                        })}
                </ListGroup>
            </Card.Body>
        </Card>
    );
}
