import React from "react";
import { AssociationLayout } from "../../Layout";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/PageTitle";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { Association } from "../../../../models/associations/association";
import { Table, useColumns } from "../../../utils/table/Table";
import Card from "react-bootstrap/Card";
import { Loanable } from "../../../../models/associations/library";
import { LoanableStatusIcon } from "./LoanableStatusIcon";
import { sortingToApiParameter } from "../../../utils/table/sorting";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import ReactMarkdown from "react-markdown";

const columnsDefinition = [
  {
    key: "name",
    header: "Objet",
    canSort: true,
    render: (loanable: Loanable) => (
      <>
        <p className="my-0">{loanable.name}</p>
        {loanable.description && (
          <ReactMarkdown
            className="small text-justify mt-2"
            source={loanable.description}
          />
        )}
      </>
    ),
  },
  {
    key: "comment",
    header: "Commentaire",
    canSort: true,
    render: (loanable: Loanable) => <ReactMarkdown source={loanable.comment} />,
  },
  {
    key: "status",
    header: "Statut",
    cellClassName: "text-center",
    render: (loanable: Loanable) => (
      <LoanableStatusIcon status={loanable.status} numberOfPendingLoans={loanable.numberOfPendingLoans} />
    ),
  },
  {
    key: "action",
    header: "Action",
    cellClassName: "text-center",
    render: (loanable: Loanable) => (
      <OverlayTrigger
        placement={"bottom"}
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
        <Link
          to={`/associations/${loanable.library}/bibliotheque/gestion/${loanable.id}/modifier`}
        >
          <Button className="btn-icon mr-1" variant="outline-primary" size="sm">
            <i className="fe fe-edit-2" />
          </Button>
        </Link>
      </OverlayTrigger>
    ),
  },
];

export const AssociationLibraryManagement = ({
  association,
}: {
  association: Association;
}) => {
  const { columns, sorting } = useColumns(columnsDefinition);

  return (
    <AssociationLayout association={association}>
      <Container>
        <PageTitle>Gestion de la bibliothèque</PageTitle>

        <Pagination
          apiMethod={api.loanables.list}
          apiKey={[
            "loanables.list",
            {
              library: association.id,
              page_size: 10,
              ordering: sortingToApiParameter(sorting),
            },
          ]}
          paginationControlProps={{
            className: "justify-content-center mb-5",
          }}
          render={(loanables, paginationControl) => (
            <>
              <Card>
                <Table columns={columns} data={loanables} />
              </Card>
              {paginationControl}
            </>
          )}
        />
      </Container>
    </AssociationLayout>
  );
};
