import React from "react";
import { Poll } from "../../../models/polls";
import "./list_polls.css";
import { dateFormatter, pluralFormatter } from "../../../utils/format";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import ListGroup from "react-bootstrap/ListGroup";

export const PollResults = ({ poll }: { poll: Poll }) => {
    let totalVotes = 0;
    poll.choices.forEach(
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
                <Card.Title as="h3">{poll.question}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>
                        {poll.publicationDate &&
                        dateFormatter(poll.publicationDate)}
                    </em>
                </Card.Subtitle>

                <ListGroup>
                    {poll.choices
                    // Sort by descending number of votes.
                        .sort(
                            (a, b) =>
                                Number(b.numberOfVotes) -
                                Number(a.numberOfVotes)
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
                                                    {`${choice.numberOfVotes} ${pluralFormatter(choice.numberOfVotes,
                                                        "vote",
                                                        "votes")}`}
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
};
