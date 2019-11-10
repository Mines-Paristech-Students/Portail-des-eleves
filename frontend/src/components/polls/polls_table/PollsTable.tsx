import React from 'react';
import {Poll} from "../../../models/polls";
import {PollsTableRow} from "./PollsTableRow";
import "./polls-table.css";
import Table from "react-bootstrap/Table";

type Props = {
    polls: Poll[],
    adminVersion?: boolean
};

export function PollsTable(props: Props) {
    return (
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
            {
                props.polls.map(
                    poll => <PollsTableRow
                        key={poll.id}
                        poll={poll}
                        adminVersion={props.adminVersion}/>
                )
            }
            </tbody>
        </Table>
    );
}
