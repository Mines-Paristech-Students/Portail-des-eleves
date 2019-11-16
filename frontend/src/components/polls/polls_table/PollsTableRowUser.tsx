import React, {useState} from 'react';
import {Poll, PollState} from "../../../models/polls";
import {dateFormatter} from "../../../utils/format";
import Button from "react-bootstrap/Button";
import Form from 'react-bootstrap/Form';

type Props = {
    poll: Poll,
    // TODO setPoll: (poll: Poll) => void
};

export function PollsTableRowUser(props: Props) {
    const [editable, setEditable] = useState<boolean>(false);

    function renderQuestion(): React.ReactElement {
        if (editable) {
            return (
                <Form.Group className="mb-0 w-75"
                            controlId={"question-" + props.poll.id}>
                    <Form.Label className="d-none">Question</Form.Label>
                    <Form.Control
                        type="text"
                                  size="sm"
                                  value={props.poll.question}/>
                </Form.Group>
            );
        } else {
            return <>{props.poll.question}</>
        }
    }

    function renderState(): React.ReactElement {
        switch (props.poll.state) {
            case PollState.Accepted:
                return <i className="fe fe-check text-success"/>;
            case PollState.Rejected:
                return <i className="fe fe-x text-danger"/>;
            case PollState.Reviewing:
                return <i className="fe fe-eye text-warning"/>;
        }
    }

    const editAction = (
        <Button className="btn-icon"
                variant="outline-primary"
                size="sm"
                onClick={(_: React.FormEvent) => setEditable(true)}>
            <i className="fe fe-edit"/>
        </Button>
    );

    const submitAction = (
        <Button className="btn-icon"
                type="submit"
                variant="outline-success"
                size="sm"
                onClick={(_: React.FormEvent) => setEditable(false)}>
            <i className="fe fe-check"/>
        </Button>
    );

    const deleteAction = (
        <Button className="btn-icon"
                variant="outline-danger"
                size="sm"
                onClick={(_: React.FormEvent) => console.log("todo")}>
            <i className="fe fe-trash-2"/>
        </Button>
    );

    function renderActions(): React.ReactElement[] {
        return editable ? [submitAction] : [editAction, deleteAction];
    }

    return (
        <tr>
            <td>{renderQuestion()}</td>
            <td>{dateFormatter(props.poll.publicationDate)}</td>
            <td>{renderState()}</td>
            <td>{props.poll.adminComment}</td>
            <td>{renderActions()}</td>
        </tr>
    );
}
