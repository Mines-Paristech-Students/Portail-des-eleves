import React, {useState} from 'react';
import {Poll, PollState} from "../../../models/polls";
import {dateFormatter} from "../../../utils/format";
import Button from "react-bootstrap/Button";
import {PollEditModal} from "./PollEditModal";

type Props = {
    poll: Poll,
    setPoll: (poll: Poll) => void,
    deletePoll: () => void,
};

export function PollsTableRowUser(props: Props) {
    const [editable, setEditable] = useState<boolean>(false);

    function render(): React.ReactElement {
        return (
            <tr>
                <PollEditModal show={editable}
                               onHide={handleHideModal}
                               poll={props.poll}
                               setPoll={props.setPoll}
                               adminVersion={false}/>
                <td>{props.poll.question}</td>
                <td>{props.poll.choices[0].text}</td>
                <td>{props.poll.choices[1].text}</td>
                <td>{dateFormatter(props.poll.publicationDate)}</td>
                <td>{renderState()}</td>
                <td>{props.poll.adminComment}</td>
                <td>{[editAction, deleteAction]}</td>
            </tr>
        )
    }

    function handleHideModal() {
        setEditable(false);
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

    function handleEdit(event: React.FormEvent): void {
        event.preventDefault();
        setEditable(true);
    }

    const editAction = (
        <Button className="btn-icon"
                variant="outline-primary"
                size="sm"
                onClick={handleEdit}>
            <i className="fe fe-edit"/>
        </Button>
    );

    function handleDelete(event: React.FormEvent): void {
        event.preventDefault();
        props.deletePoll();
    }

    const deleteAction = (
        <Button className="btn-icon"
                variant="outline-danger"
                size="sm"
                onClick={handleDelete}>
            <i className="fe fe-trash-2"/>
        </Button>
    );

    return render();
}
