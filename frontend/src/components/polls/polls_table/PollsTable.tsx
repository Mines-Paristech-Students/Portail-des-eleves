import React, { useContext } from "react";
import { Poll } from "../../../models/polls";
import { PollsTableRowAdmin } from "./PollsTableRowAdmin";
import "./polls-table.css";
import Table from "react-bootstrap/Table";
import { PollsTableRowUser } from "./PollsTableRowUser";
import Card from "react-bootstrap/Card";

import { PollsBase } from "../PollsBase";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import { PollsLoading } from "../PollsLoading";
import { PollsError } from "../PollsError";
import { UserContext } from "../../../services/authService";

export const PollsTable = ({ adminVersion }: { adminVersion?: boolean }) => {
    const user = useContext(UserContext);

    const { data: polls, error, status, refetch } = useBetterQuery<Poll[]>(
        "polls.list",
        api.polls.list,
        [],
        { refetchOnWindowFocus: false }
    );

    function Content() {
        if (status === "loading") return <PollsLoading />;
        else if (status === "success" && polls && user) {
            return (
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
                                          <PollsTableRowAdmin
                                              key={
                                                  "polls-table-row-admin-" +
                                                  poll.id
                                              }
                                              poll={poll}
                                              refetch={refetch}
                                          />
                                      ))
                                    : // Only display their own polls to a normal user.
                                      polls
                                          .filter(poll => poll.user === user.id)
                                          .map(poll => (
                                              <PollsTableRowUser
                                                  key={
                                                      "polls-table-row-user-" +
                                                      poll.id
                                                  }
                                                  poll={poll}
                                                  refetch={refetch}
                                              />
                                          ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            );
        } else {
            return <PollsError detail={error} />;
        }
    }

    return (
        <PollsBase>
            {adminVersion ? (
                <PageTitle>Administration</PageTitle>
            ) : (
                <PageTitle>Mes sondages</PageTitle>
            )}
            <Content />
        </PollsBase>
    );
};
