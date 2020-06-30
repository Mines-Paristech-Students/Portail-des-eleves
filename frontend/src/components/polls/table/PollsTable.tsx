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
import {
  PollsTableFilter,
  PollStateFilter,
  pollStateFilterToApiParameter,
} from "./PollsTableFilter";
import { UserContext } from "../../../services/authService";
import { Table, useColumns } from "../../utils/table/Table";
import { PollEditModal } from "./PollEditModal";
import { Column } from "../../utils/table/TableHeader";
import { sortingToApiParameter } from "../../utils/table/sorting";
import { PageTitle } from "../../utils/PageTitle";

/**
 * Display a table (either for an administrator or a simple user).
 * The polls may be edited in a modal, shown when setting `editPoll` thanks to
 * the callback `setEditPoll` provided to `columnData` (which should thus be
 * a function).
 */
export const PollsTable = ({
  adminVersion,
  columnData,
}: {
  adminVersion: boolean;
  columnData: (setEditPoll) => Column[];
}) => {
  const user = useContext(UserContext);

  // Contains the poll currently edited in the modal.
  const [editPoll, setEditPoll] = useState<Poll | null>(null);

  // Create the sorting.
  const { columns, sorting } = useColumns<Poll>(columnData(setEditPoll));

  // By default, show all the polls to the simple users  and only the polls to be
  // reviewed to the admins.
  const defaultStateFilter: PollStateFilter = {
    accepted: !adminVersion,
    rejected: !adminVersion,
    reviewing: true,
  };

  const [stateFilter, setStateFilter] = useState<PollStateFilter>(
    defaultStateFilter
  );

  return !authService.isStaff && adminVersion ? (
    <ForbiddenError />
  ) : (
    <PollsBase
      sidebarActions={
        <PollsTableFilter
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
          formGroupProps={{ className: "mb-0" }}
        />
      }
    >
      <PageTitle>{adminVersion ? "Administration" : "Mes sondages"}</PageTitle>
      <Card>
        <Pagination
          apiMethod={api.polls.list}
          apiKey={[
            "polls.list",
            {
              user: !adminVersion && user ? user.id : undefined,
              state: pollStateFilterToApiParameter(stateFilter),
              ordering: sortingToApiParameter(sorting, {
                question: "question",
                publicationDate: "publication_date",
                user: "user__pk",
                state: "state",
              }),
            },
          ]}
          config={{ refetchOnWindowFocus: false }}
          loadingElement={PollsLoading}
          errorElement={PollsError}
          paginationControlProps={{
            className: "justify-content-center mt-5",
          }}
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
        />
      </Card>
    </PollsBase>
  );
};
