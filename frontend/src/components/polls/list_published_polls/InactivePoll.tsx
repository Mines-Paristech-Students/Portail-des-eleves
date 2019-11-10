import React from 'react';
import {
    Card,
    CardBody,
    CardHeader,
    CardSubtitle,
    CardTitle,
    ListGroup,
    ListGroupItem,
    Progress
} from "reactstrap";
import {Poll} from "../../../models/polls";
import "./list_published_polls.css";

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
            <CardHeader>
                <CardTitle>{props.poll.question}</CardTitle>
            </CardHeader>
            <CardBody>
                <CardSubtitle className="poll-date">
                    <em>{props.poll.publicationDate.getDate()}/{props.poll.publicationDate.getMonth()}/{props.poll.publicationDate.getFullYear()}</em>
                </CardSubtitle>

                <ListGroup>
                    {props.poll.choices.map(
                        choice => {
                            if (choice.numberOfVotes) {
                                return (
                                    <ListGroupItem key={choice.id}>
                                        <h5>{choice.text}</h5>
                                        <Progress
                                            value={choice.numberOfVotes}
                                            max={totalVotes}
                                            color={getColor(choice.numberOfVotes, totalVotes)}>
                                            {choice.numberOfVotes}
                                        </Progress>
                                    </ListGroupItem>
                                );
                            } else {
                                return <></>;
                            }
                        }
                    )}
                </ListGroup>
            </CardBody>
        </Card>
    );
}
