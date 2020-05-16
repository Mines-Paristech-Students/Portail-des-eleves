import React, { useContext, useState } from "react";
import { Poll } from "../../../models/polls";
import "./polls-table.css";
import Card from "react-bootstrap/Card";

import { PollsBase } from "../PollsBase";
import { api } from "../../../services/apiService";
import { PollsLoading } from "../PollsLoading";
import { PollsError } from "../PollsError";
import { authService } from "../../../App";
import { ForbiddenError } from "../../utils/ErrorPage";
import { Pagination } from "../../utils/Pagination";
import { PollsTableFilter, PollStateFilter } from "./PollsTableFilter";
import { AuthContext } from "../../../services/authService";
import { Table, useColumns } from "../../utils/table/Table";
import { PollEditModal } from "./PollEditModal";
import { Column } from "../../utils/table/TableHeader";

export const PollsTable = ({
    adminVersion,
    columnData,
}: {
    adminVersion: boolean;
    columnData: (setEditPoll) => Column[];
}) => {
    const auth = useContext(AuthContext);

    // Only filter by auth for the non admin version.
    const userFilter = () => (!adminVersion && auth ? auth.id : "");

    // Contains the poll currently edited in the modal.
    const [editPoll, setEditPoll] = useState<Poll | null>(null);

    // Create the sorting.
    const { columns, sorting } = useColumns<Poll>(columnData(setEditPoll));

    // By default, show all the polls to the simple users and only the polls to be reviewed to the admins.
    const defaultStateFilter: PollStateFilter = {
        accepted: !adminVersion,
        rejected: !adminVersion,
        reviewing: true,
    };

    const [stateFilter, setStateFilter] = useState<PollStateFilter>(
        defaultStateFilter
    );

    if (!authService.isStaff && adminVersion) {
        return <ForbiddenError />;
    }

    return (
        <PollsBase
            sidebarActions={
                <PollsTableFilter
                    defaultStateFilter={defaultStateFilter}
                    setStateFilter={setStateFilter}
                    formGroupProps={{ className: "mb-0" }}
                />
            }
        >
            <div className="page-header mt-0 mb-5">
                <h1 className="page-title">
                    {adminVersion ? "Administration" : "Mes sondages"}
                </h1>
            </div>

            <Card>
                <Card.Body>
                    <Pagination
                        render={(polls: Poll[], paginationControl) => (
                            <>
                                <PollEditModal
                                    show={editPoll !== null}
                                    onHide={() => setEditPoll(null)}
                                    poll={editPoll}
                                    adminVersion={adminVersion}
                                />
                                <Table columns={columns} data={polls} />
                                {paginationControl}
                            </>
                        )}
                        apiKey={[
                            "polls.list",
                            {
                                userFilter: userFilter(),
                                stateFilter: stateFilter,
                                sorting: sorting,
                            },
                        ]}
                        apiMethod={api.polls.listAll}
                        config={{ refetchOnWindowFocus: false }}
                        loadingElement={PollsLoading}
                        errorElement={PollsError}
                        paginationControlProps={{
                            className: "justify-content-center mt-5",
                        }}
                    />
                </Card.Body>
            </Card>
        </PollsBase>
    );
};
