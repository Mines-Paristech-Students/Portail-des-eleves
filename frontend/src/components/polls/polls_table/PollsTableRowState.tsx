import React from 'react';
import {PollState} from "../../../models/polls";

import Form from 'react-bootstrap/Form';

type Props = {
    pollState: PollState
    editable?: boolean
    setPollState?: (status: PollState) => void
};

export function PollsTableRowState(props: Props) {
    const accepted = <><span className="status-icon bg-success"/>Accepté</>;
    const rejected = <><span className="status-icon bg-danger"/>Refusé</>;
    const reviewing = <><span className="status-icon bg-warning"/>En attente</>;

    if (props.editable && props.setPollState !== undefined) {
        return (
            <td>
                <Form.Group controlId="pollState">
                    <Form.Control as="select"
                                  className="form-control custom-select-sm">
                        <option>Accepté</option>
                        <option>Refusé</option>
                        <option>En attente</option>
                    </Form.Control>
                </Form.Group>
            </td>
        )
    } else {
        switch (props.pollState) {
            case PollState.Accepted:
                return <td>{accepted}</td>;
            case PollState.Rejected:
                return <td>{rejected}</td>;
            case PollState.Reviewing:
                return <td>{reviewing}</td>;
        }
    }
}
