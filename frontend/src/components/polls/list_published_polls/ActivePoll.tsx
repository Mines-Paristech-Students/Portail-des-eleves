import React from 'react';
import {Card, CardBody, CardHeader, CardSubtitle, CardTitle} from "reactstrap";
import {Poll} from "../../../models/polls";
import {ActivePollForm} from "./ActivePollForm";

type Props = {
    poll: Poll,
};

export function ActivePoll(props: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{props.poll.question}</CardTitle>
            </CardHeader>
            <CardBody>
                <CardSubtitle className="poll-date">
                    <em>{props.poll.publicationDate.getDate()}/{props.poll.publicationDate.getMonth()}/{props.poll.publicationDate.getFullYear()}</em>
                </CardSubtitle>
                <ActivePollForm poll={props.poll}/>
            </CardBody>
        </Card>
    );
}
