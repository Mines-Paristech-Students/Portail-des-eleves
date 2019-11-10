import React from 'react';
import {Poll} from "../../../models/polls";
import {ActivePollForm} from "./ActivePollForm";
import {dateFormatter} from "../../../utils/date";
import Card from "react-bootstrap/Card";

type Props = {
    poll: Poll,
};

export function ActivePoll(props: Props) {
    return (
        <Card>
            <Card.Header>
                <Card.Title>{props.poll.question}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Subtitle className="poll-date">
                    <em>{dateFormatter(props.poll.publicationDate)}</em>
                </Card.Subtitle>
                <ActivePollForm poll={props.poll}/>
            </Card.Body>
        </Card>
    );
}
