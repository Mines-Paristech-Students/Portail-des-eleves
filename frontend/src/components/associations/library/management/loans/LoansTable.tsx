import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../../../utils/Pagination";
import { api } from "../../../../../services/apiService";
import { Table, useColumns } from "../../../../utils/table/Table";
import { Loan } from "../../../../../models/associations/library";
import dayjs from "dayjs";
import { LoanStatusTag } from "./LoanStatusTag";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { sortingToApiParameter } from "../../../../utils/table/sorting";
import { EditLoanModal } from "./EditLoanModal";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../../utils/Toast";
import { ListLoansApiParameters } from "../../../../../services/api/library/loans";

const columnsDefinition = (setEditLoan) => [
  {
    key: "user",
    header: "Élève",
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
    render: (loan: Loan) => (
      <LoanStatusTag status={loan.status} priority={loan.priority} />
    ),
  },
  {
    key: "edit",
    header: "Modifier",
    render: (loan: Loan) =>
      loan.status !== "CANCELLED" && (
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
export const LoansTable = ({
  loanableId,
  apiParameters,
}: {
  loanableId: string;
  apiParameters?: Partial<ListLoansApiParameters>;
}) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  // The loan edited in the modal.
  const [editLoan, setEditLoan] = useState<Loan | null>(null);

  const { columns, sorting } = useColumns(columnsDefinition(setEditLoan));

  const [edit] = useMutation(api.loans.patch, {
    onMutate: () => sendInfoToast("Modification en cours…"),
    onSuccess: () => {
      sendSuccessToast("Modifications enregistrées !");
      queryCache.invalidateQueries(["loans.list"]);
      setEditLoan(null);
    },
    onError: () => sendErrorToast("Une erreur est survenue."),
  });

  // Submit the form in the modal.
  const submit = (values, { setSubmitting }) => {
    if (editLoan) {
      if (values.status !== "RETURNED") {
        // `realReturnDate` may only change when the loanable returns.
        values.realReturnDate = null;

        // `loanDate` and `expectedReturnDate` may only change when the loanable
        // is borrowed. Otherwise, they should be reset.
        if (values.status !== "BORROWED") {
          values.loanDate = null;
          values.expectedReturnDate = null;
        }
      } else {
        // When updating the status to `RETURNED`, we don't want these dates
        // to change.
        delete values.loanDate;
        delete values.expectedReturnDate;
      }

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
  };

  // Hide the modal.
  const hide = () => setEditLoan(null);

  return (
    <>
      <EditLoanModal
        show={editLoan !== null}
        onHide={() => setEditLoan(null)}
        onSubmit={(...args) => {
          hide();
          submit(...args);
        }}
        loan={editLoan}
      />

      <Pagination
        apiMethod={api.loans.list}
        apiKey={[
          "loans.list",
          {
            loanable: { id: loanableId },
            ordering: sortingToApiParameter(sorting, { user: "user__id" }),
            ...apiParameters,
          },
        ]}
        paginationControlProps={{
          className: "justify-content-center mt-5",
        }}
        config={{ refetchOnWindowFocus: false }}
        render={(loans, paginationControl) => (
          <>
            <Card>
              <Card.Header>
                <Card.Title>Toutes les demandes</Card.Title>
              </Card.Header>
              <Table columns={columns} data={loans} borderTop={false} />
            </Card>
            {paginationControl}
          </>
        )}
      />
    </>
  );
};
