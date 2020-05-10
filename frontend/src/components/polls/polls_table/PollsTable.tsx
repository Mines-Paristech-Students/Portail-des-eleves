import React from "react";
import { Poll } from "../../../models/polls";
import { PollsTableRowAdmin } from "./PollsTableRowAdmin";
import "./polls-table.css";
import Table from "react-bootstrap/Table";
import { PollsTableRowUser } from "./PollsTableRowUser";
import Card from "react-bootstrap/Card";

import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../utils/PageTitle";
import { api } from "../../../services/apiService";
import { PollsLoading } from "../PollsLoading";
import { PollsError } from "../PollsError";
import { authService } from "../../../App";
import { ForbiddenError } from "../../utils/ErrorPage";
import { Pagination } from "../../utils/Pagination";

const Content = ({ adminVersion, polls, paginationControl }) => (
    <Card>
        <Card.Body>
            <Table className="card-table polls-table text-left">
                <thead className="text-center">
                    <tr>
                        <th>Question</th>
                        <th>Réponse 1</th>
                        <th>Réponse 2</th>
                        <th>Publication</th>
                        {adminVersion && <th>Auteur</th>}
                        <th>Statut</th>
                        {!adminVersion && <th>Commentaire</th>}
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {adminVersion
                        ? // Display all the polls in the administrator panel.
                          polls.map(poll => (
                              <PollsTableRowAdmin key={poll.id} poll={poll} />
                          ))
                        : // Only display their own polls to a normal user.
                          polls.map(poll => (
                              <PollsTableRowUser key={poll.id} poll={poll} />
                          ))}
                </tbody>
            </Table>

            {paginationControl}
        </Card.Body>
    </Card>
);

export const PollsTable = ({ adminVersion }: { adminVersion?: boolean }) => {
    if (authService.isStaff || !adminVersion) {
        return (
            <PollsBase>
                {adminVersion ? (
                    <PageTitle>Administration</PageTitle>
                ) : (
                    <PageTitle>Mes sondages</PageTitle>
                )}
                <Pagination
                    render={(polls: Poll[], paginationControl) => (
                        <Content
                            adminVersion={adminVersion}
                            polls={polls}
                            paginationControl={paginationControl}
                        />
                    )}
                    apiKey={["polls.list"]}
                    apiMethod={api.polls.listAll}
                    config={{ refetchOnWindowFocus: false }}
                    loadingElement={<PollsLoading />}
                    errorElement={<PollsError />}
                    paginationProps={{
                        className: "justify-content-center mt-5"
                    }}
                />
            </PollsBase>
        );
    } else {
        return <ForbiddenError />;
    }
};
