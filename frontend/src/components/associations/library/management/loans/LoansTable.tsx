import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../../../utils/Pagination";
import { api } from "../../../../../services/apiService";
import { Table, useColumns } from "../../../../utils/table/Table";
import { Loan, Loanable } from "../../../../../models/associations/library";
import dayjs from "dayjs";
import { LoanStatus } from "./LoanStatus";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { sortingToApiParameter } from "../../../../utils/table/sorting";

const columnsDefinition = (setEditLoan) => [
  {
    key: "user",
    header: "Utilisateur(trice)",
    canSort: true,
  },
  {
    key: "request_date",
    header: "Date de demande",
    render: (loan: Loan) => dayjs(loan.requestDate).format("DD/MM/YYYY HH:mm"),
    canSort: true,
  },
  {
    key: "status",
    header: "Statut",
    render: (loan: Loan) => <LoanStatus status={loan.status} />,
  },
  {
    key: "edit",
    header: "Modifier",
    render: (loan: Loan) => (
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip id="edit">Modifier</Tooltip>}
        popperConfig={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 8],
              },
            },
          ],
        }}
      >
        <Button className="btn-icon mr-1" variant="outline-primary" size="sm">
          <i className="fe fe-edit-2" />
        </Button>
      </OverlayTrigger>
    ),
  },
];

/**
 * Displays a table gathering information about the loans.
 * Also manages a modal for editing a loan.
 */
export const LoansTable = ({ loanableId }: { loanableId: string }) => {
  const [editLoan, setEditLoan] = useState<Loan | null>(null);
  const { columns, sorting } = useColumns(columnsDefinition(setEditLoan));

  return (
    <>
      <Card>
        <Card.Header>
          <Card.Title>Toutes les demandes</Card.Title>
        </Card.Header>

        <Pagination
          apiMethod={api.loans.list}
          apiKey={[
            "loans.list",
            {
              loanable: { id: loanableId },
              ordering: sortingToApiParameter(sorting, { user: "user__id" }),
            },
          ]}
          paginationControlProps={{
            className: "justify-content-center mt-5",
          }}
          render={(loans, paginationControl) => (
            <>
              <Table columns={columns} data={loans} borderTop={false} />
              {paginationControl}
            </>
          )}
        />
      </Card>
    </>
  );
};
