import React, {useState} from 'react';
import {Poll} from "../../../models/polls";
import {PollsTableRowAdmin} from "./PollsTableRowAdmin";
import "./polls-table.css";
import Table from "react-bootstrap/Table";
import {PollsTableRowUser} from "./PollsTableRowUser";
import {LinkData} from "../../../utils/link_data";
import {PollsBreadcrumbBar} from "../PollsBreadcrumbBar";
import {ActionBar} from "../../ActionBar";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

import * as data from "../../../fixtures/polls"

type Props = {
    adminVersion?: boolean,
};

export function PollsTable(props: Props) {
    const [polls, setPolls] = useState<Poll[]>(data.polls);

    function setPoll(id: number, poll: Poll) {
        console.log(poll);
        setPolls([
            ...polls.slice(0, id),
            poll,
            ...polls.slice(id + 1)
        ])
    }

    function deletePoll(id: number) {
        setPolls([
            ...polls.slice(0, id),
            ...polls.slice(id + 1)
        ])
    }

    function getActions(): LinkData[] {
        if (props.adminVersion) {
            return [];
        } else {
            return [
                {
                    name: "Proposer",
                    to: "../proposer/",
                },
            ]
        }
    }

    function getBreadcrumbs(): LinkData[] {
        if (props.adminVersion) {
            return [
                {
                    name: "Administration",
                    to: "#",
                }
            ];
        } else {
            return [
                {
                    name: "Mes sondages",
                    to: "#",
                }
            ];
        }
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
            return polls.map((poll, index) => <PollsTableRowAdmin key={"polls-table-row-admin-" + poll.id}
                                                                  poll={poll}
                                                                  setPoll={(poll: Poll) => setPoll(index, poll)}/>)
        } else {
            return polls.map((poll, index) => <PollsTableRowUser key={"polls-table-row-user-" + poll.id}
                                                                 poll={poll}
                                                                 setPoll={(poll: Poll) => setPoll(index, poll)}
                                                                 deletePoll={() => deletePoll(index)}/>)
        }
    }

    return (
        <>
            <PollsBreadcrumbBar breadcrumbs={getBreadcrumbs()}/>
            <ActionBar actions={getActions()}/>

            <Container>
                <h1 className="page-title page-header">{renderTitle()}</h1>

                <Card>
                    <Card.Body>
                        <Table className="card-table polls-table text-left">
                            <thead>
                            <tr>
                                <th>Question</th>
                                <th>Réponse 1</th>
                                <th>Réponse 2</th>
                                <th>Date</th>
                                {props.adminVersion && <th>Auteur</th>}
                                <th>Statut</th>
                                {!props.adminVersion && <th>Commentaire</th>}
                                <th>Actions</th>
                            </tr>
                            </thead>

                            <tbody>
                            {renderBody()}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}
