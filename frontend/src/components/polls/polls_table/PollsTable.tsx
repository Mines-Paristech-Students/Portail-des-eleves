import React, { useState } from "react";
import { Poll } from "../../../models/polls";
import { PollsTableRowAdmin } from "./PollsTableRowAdmin";
import "./polls-table.css";
import Table from "react-bootstrap/Table";
import { PollsTableRowUser } from "./PollsTableRowUser";
import Card from "react-bootstrap/Card";

import * as data from "../../../fixtures/polls";
import { PollsBase } from "../PollsBase";

type Props = {
    adminVersion?: boolean;
};

export function PollsTable(props: Props) {
    const [polls, setPolls] = useState<Poll[]>(data.polls);

    function setPoll(id: number, poll: Poll) {
        setPolls([...polls.slice(0, id), poll, ...polls.slice(id + 1)]);
    }

    function deletePoll(id: number) {
        setPolls([...polls.slice(0, id), ...polls.slice(id + 1)]);
    }

    function renderContent() {
        return (
            <>
                <Card>
                    <Card.Body>
                        <Table className="card-table polls-table text-left">
                            <thead className="text-center">
                                <tr>
                                    <th>Question</th>
                                    <th>Réponse 1</th>
                                    <th>Réponse 2</th>
                                    <th>Date</th>
                                    {props.adminVersion && <th>Auteur</th>}
                                    <th>Statut</th>
                                    {!props.adminVersion && (
                                        <th>Commentaire</th>
                                    )}
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>{renderBody()}</tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </>
        );
    }

    function renderTitle() {
        if (props.adminVersion) {
            return "Administration";
        } else {
            return "Mes sondages";
        }
    }

    function renderBody() {
        if (props.adminVersion) {
            return polls.map((poll, index) => (
                <PollsTableRowAdmin
                    key={"polls-table-row-admin-" + poll.id}
                    poll={poll}
                    setPoll={(poll: Poll) => setPoll(index, poll)}
                />
            ));
        } else {
            return polls.map((poll, index) => (
                <PollsTableRowUser
                    key={"polls-table-row-user-" + poll.id}
                    poll={poll}
                    setPoll={(poll: Poll) => setPoll(index, poll)}
                    deletePoll={() => deletePoll(index)}
                />
            ));
        }
    }

    return (
        <PollsBase
            title={
                <h1 className="page-title page-header mb-5">{renderTitle()}</h1>
            }
        >
            {renderContent()}
        </PollsBase>
    );
}
