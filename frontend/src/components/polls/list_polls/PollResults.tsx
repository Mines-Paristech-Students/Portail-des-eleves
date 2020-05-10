import React from "react";
import { Poll } from "../../../models/polls";
import "./list_polls.css";
import { formatDate, decidePlural } from "../../../utils/format";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";

const totalVotes = poll =>
    poll.choices.reduce(
        (total, choice) =>
            choice.numberOfVotes ? total + choice.numberOfVotes : total,
        0
    );

const getColor = (
    numberOfVotes: number,
    totalVotes: number
): "success" | "warning" | "danger" => {
    if (numberOfVotes > totalVotes / 2) {
        return "success";
    } else if (numberOfVotes > totalVotes / 3) {
        return "warning";
    }
    return "danger";
};

export const PollResults = ({ poll }: { poll: Poll }) => (
    <Card>
        <Card.Header>
            <Card.Title as="h3">{poll.question}</Card.Title>
        </Card.Header>
        <Card.Body>
            <Card.Subtitle className="poll-date">
                <em>
                    {poll.publicationDate && formatDate(poll.publicationDate)} (
                    {`${totalVotes(poll)} ${decidePlural(
                        totalVotes(poll),
                        "vote",
                        "votes"
                    )}`}
                    )
                </em>
            </Card.Subtitle>

            <ListGroup>
                {poll.choices
                    // Sort by descending number of votes.
                    .sort(
                        (a, b) =>
                            Number(b.numberOfVotes) - Number(a.numberOfVotes)
                    )
                    .map(choice => {
                        if (choice.numberOfVotes !== undefined) {
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
                                                {Number(
                                                    (100 *
                                                        choice.numberOfVotes) /
                                                        totalVotes(poll)
                                                )}{" "}
                                                %
                                            </small>
                                        </div>
                                    </div>
                                    <ProgressBar
                                        className="progress-sm"
                                        now={choice.numberOfVotes}
                                        min={0}
                                        max={totalVotes(poll)}
                                        variant={getColor(
                                            choice.numberOfVotes,
                                            totalVotes(poll)
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
