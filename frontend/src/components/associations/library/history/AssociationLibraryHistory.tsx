import { Association } from "../../../../models/associations/association";
import React, { useContext, useState } from "react";
import {
  Loan,
  LOAN_STATUS_TRANSLATION,
  LoanStatus,
} from "../../../../models/associations/library";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Button from "react-bootstrap/Button";
import { Table, useColumns } from "../../../utils/table/Table";
import { AssociationLayout } from "../../Layout";
import { SidebarSeparator, SidebarSpace } from "../../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../../utils/sidebar/SidebarInputSearch";
import { SidebarSection } from "../../../utils/sidebar/SidebarSection";
import {
  CheckboxField,
  updateStatus,
} from "../../../utils/sidebar/CheckboxField";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/PageTitle";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { sortingToApiParameter } from "../../../utils/table/sorting";
import Card from "react-bootstrap/Card";
import { LoanStatusTag } from "../management/loans/LoanStatusTag";
import dayjs from "dayjs";
import { queryCache, useMutation } from "react-query";
import { ToastContext } from "../../../utils/Toast";
import { LoanReturnDate } from "../LoanReturnDate";

const columnsDefinition = (cancel) => [
  {
    key: "loanable__name",
    header: "Objet",
    canSort: true,
    render: (loan: Loan) => loan.loanable.name,
  },
  {
    key: "status",
    header: "Statut",
    render: (loan: Loan) => <LoanStatusTag status={loan.status} />,
  },
  {
    key: "request_date",
    header: "Demande",
    render: (loan: Loan) => dayjs(loan.requestDate).format("DD/MM/YYYY HH:mm"),
    canSort: true,
  },
  {
    key: "expected_return_date",
    header: "Retour",
    render: (loan: Loan) => <LoanReturnDate loan={loan}/>
  },
  {
    key: "actions",
    header: "Action",
    headerClassName: "w-auto",
    render: (loan: Loan) =>
      loan.status === "PENDING" && (
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="edit">Annuler la demande</Tooltip>}
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
            className="btn-icon m-1"
            variant="outline-danger"
            size="sm"
            onClick={() => cancel(loan.id)}
          >
            <i className="fe fe-x" />
          </Button>
        </OverlayTrigger>
      ),
  },
];

export const AssociationLibraryHistory = ({
  association,
}: {
  association: Association;
}) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
    ToastContext
  );

  const [cancel] = useMutation(api.loans.cancel, {
    onMutate: () => sendInfoToast("Annulation en cours..."),
    onSuccess: () => {
      sendSuccessToast("Demande annulée.");
      queryCache.invalidateQueries("loans.list");
    },
    onError: () => sendErrorToast("L’annulation a échoué."),
  });

  const [searchParams, setSearchParams] = useState({});
  const [statusParams, setStatusParams] = useState<{ status: LoanStatus[] }>({
    status: ["PENDING", "ACCEPTED", "BORROWED"],
  });

  const { columns, sorting } = useColumns(columnsDefinition(cancel));

  return (
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSeparator />
          <SidebarInputSearch
            setParams={setSearchParams}
            placeholder="Chercher un objet"
          />
          <SidebarSpace />
          <SidebarSection
            title="Voir les statuts..."
            retractable={false}
            retractedByDefault={false}
          >
            {LOAN_STATUS_TRANSLATION.map(([value, label]) => (
              <CheckboxField
                key={value}
                label={label}
                state={statusParams.status.includes(value)}
                onChange={(checked) =>
                  setStatusParams((oldStatus) => ({
                    status: updateStatus(checked, value, oldStatus.status),
                  }))
                }
              />
            ))}
          </SidebarSection>
        </>
      }
    >
      <Container>
        <PageTitle>Mes demandes</PageTitle>

        <Pagination
          apiMethod={api.loans.list}
          apiKey={[
            "loans.list",
            {
              loanable: { library: association.id },
              page_size: 10,
              ordering: sortingToApiParameter(sorting),
              ...searchParams,
              ...statusParams,
            },
          ]}
          paginationControlProps={{
            className: "justify-content-center mb-5",
          }}
          render={(loans, paginationControl) => (
            <>
              <Card>
                <Table columns={columns} data={loans} borderTop={false} />
              </Card>
              {paginationControl}
            </>
          )}
        />
      </Container>
    </AssociationLayout>
  );
};
