import React from 'react';
import {Poll} from "../../../models/polls";
import {PollsTableRowAdmin} from "./PollsTableRowAdmin";
import "./polls-table.css";
import Table from "react-bootstrap/Table";
import Container from 'react-bootstrap/Container';
import {PollsTableRowUser} from "./PollsTableRowUser";
import Form from 'react-bootstrap/Form';

type Props = {
    polls: Poll[],
    adminVersion?: boolean
};

export function PollsTable(props: Props) {
    function renderBody() {
        if (props.adminVersion) {
            return props.polls.map(poll => <PollsTableRowAdmin key={poll.id}
                                                               poll={poll}/>)
        } else {
            return props.polls.map(poll => <PollsTableRowUser key={poll.id}
                                                              poll={poll}/>)
        }
    }

    return (
        <Form>
            <Table className="card-table polls-table">
                <thead>
                <tr>
                    <th>Question</th>
                    <th>Date</th>
                    {props.adminVersion && <th>Auteur</th>}
                    <th>Statut</th>
                    <th>Commentaire</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {renderBody()}
                </tbody>
            </Table>
        </Form>
    );
}
