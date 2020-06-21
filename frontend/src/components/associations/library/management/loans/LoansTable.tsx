import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../../../utils/Pagination";
import { api } from "../../../../../services/apiService";
import { Table, useColumns } from "../../../../utils/table/Table";
import { Loan } from "../../../../../models/associations/library";
import dayjs from "dayjs";
import { LoanStatusBadge } from "./LoanStatusBadge";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { sortingToApiParameter } from "../../../../utils/table/sorting";
import { EditLoanModal } from "./EditLoanModal";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../../utils/Toast";

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
    render: (loan: Loan) => <LoanStatusBadge status={loan.status} />,
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
        <Button
          className="btn-icon mr-1"
          variant="outline-primary"
          size="sm"
          onClick={() => setEditLoan(loan)}
        >
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
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const [editLoan, setEditLoan] = useState<Loan | null>(null);
  const { columns, sorting } = useColumns(columnsDefinition(setEditLoan));

  const [edit] = useMutation(api.loans.patch, {
    onMutate: () => sendInfoToast("Modification en cours…"),
    onSuccess: () => {
      sendSuccessToast("Modifications enregistrées !");
      queryCache.refetchQueries("loans.list");
      setEditLoan(null);
    },
    onError: () => sendErrorToast("Une erreur est survenue."),
  });

  return (
    <>
      <EditLoanModal
        show={editLoan !== null}
        onHide={() => setEditLoan(null)}
        onSubmit={(values, { setSubmitting }) => {
          if (editLoan) {
            edit(
              {
                id: editLoan.id,
                data: values,
              },
              {
                onSettled: () => setSubmitting(false),
              }
            );
          }
        }}
        loan={editLoan}
      />

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
