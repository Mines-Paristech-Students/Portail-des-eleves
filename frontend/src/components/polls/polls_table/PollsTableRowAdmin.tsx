import React, { useState } from "react";
import { Poll, PollState } from "../../../models/polls";
import { dateFormatter } from "../../../utils/format";
import Button from "react-bootstrap/Button";
import { PollEditModal } from "./PollEditModal";

type Props = {
    poll: Poll;
    setPoll: (poll: Poll) => void;
};

export function PollsTableRowAdmin(props: Props) {
    const [editable, setEditable] = useState<boolean>(false);

    function render(): React.ReactElement {
        return (
            <tr>
                <PollEditModal
                    show={editable}
                    onHide={handleHideModal}
                    poll={props.poll}
                    setPoll={props.setPoll}
                    adminVersion={true}
                />
                <td>{props.poll.question}</td>
                <td>{props.poll.choices[0].text}</td>
                <td>{props.poll.choices[1].text}</td>
                <td>{dateFormatter(props.poll.publicationDate)}</td>
                <td>17TODO</td>
                <td className="text-center">{renderState()}</td>
                <td className="text-center">{administrateAction}</td>
            </tr>
        );
    }

    function handleHideModal() {
        setEditable(false);
    }

    function renderState(): React.ReactElement {
        switch (props.poll.state) {
            case PollState.Accepted:
                return <i className="fe fe-check text-success" />;
            case PollState.Rejected:
                return <i className="fe fe-x text-danger" />;
            case PollState.Reviewing:
                return <i className="fe fe-eye text-warning" />;
        }
    }

    function handleAdministrate(event: React.FormEvent): void {
        event.preventDefault();
        setEditable(true);
    }

    const administrateAction = (
        <Button
            className="btn-icon mr-1"
            variant="outline-primary"
            size="sm"
            onClick={handleAdministrate}
        >
            <i className="fe fe-check-square" />
        </Button>
    );

    return render();
}
