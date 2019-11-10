import React from 'react';
import Form from 'react-bootstrap/Form';

type Props = {
    adminComment: string
    editable?: boolean
    setAdminComment?: (adminComment: string) => void
};

export function PollsTableRowAdminComment(props: Props) {
    if (props.editable) {
        return (
            <td>
                <Form.Group controlId="adminComment">
                    <Form.Control type="text"
                                  value={props.adminComment}
                    />
                </Form.Group>
            </td>
        )
    } else {
        return <td>{props.adminComment}</td>
    }
}
