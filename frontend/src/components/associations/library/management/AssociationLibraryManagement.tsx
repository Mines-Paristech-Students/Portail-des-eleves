import React, { useState } from "react";
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
import { SidebarSeparator, SidebarSpace } from "../../../utils/sidebar/Sidebar";
import { SidebarInputSearch } from "../../../utils/sidebar/SidebarInputSearch";
import { SidebarSection } from "../../../utils/sidebar/SidebarSection";
import { CheckboxField } from "../../../utils/sidebar/CheckboxField";

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
      <LoanableStatusIcon status={loanable.status} />
    ),
  },
  {
    key: "actions",
    header: "Actions",
    cellClassName: "text-center",
    render: (loanable: Loanable) => (
      <>
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="edit">Gérer les demandes</Tooltip>}
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
            to={`/associations/${loanable.library}/bibliotheque/gestion/${loanable.id}/demandes`}
          >
            <Button
              className="btn-icon m-1"
              variant="outline-primary"
              size="sm"
            >
              <i className="fe fe-help-circle" />
            </Button>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger
          placement={"bottom"}
          overlay={<Tooltip id="edit">Modifier l’objet</Tooltip>}
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
            <Button
              className="btn-icon m-1"
              variant="outline-secondary"
              size="sm"
            >
              <i className="fe fe-edit-2" />
            </Button>
          </Link>
        </OverlayTrigger>
      </>
    ),
  },
];

export const AssociationLibraryManagement = ({
  association,
}: {
  association: Association;
}) => {
  const { columns, sorting } = useColumns(columnsDefinition);

  const [searchParams, setSearchParams] = useState({});
  const [statusParams, setStatusParams] = useState({
    status: ["REQUESTED"],
  });

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
            title="Voir les objets..."
            retractable={false}
            retractedByDefault={false}
          >
            <CheckboxField
              label={"Prêtés"}
              state={statusParams.status.includes("BORROWED")}
              onChange={(ticked) =>
                setStatusParams((oldStatus) => ({
                  status: ticked
                    ? [...oldStatus.status, "BORROWED"]
                    : oldStatus.status.filter((x) => x !== "BORROWED"),
                }))
              }
            />
            <CheckboxField
              label={"Demandés"}
              state={statusParams.status.includes("REQUESTED")}
              onChange={(ticked) =>
                setStatusParams((oldStatus) => ({
                  status: ticked
                    ? [...oldStatus.status, "REQUESTED"]
                    : oldStatus.status.filter((x) => x !== "REQUESTED"),
                }))
              }
            />
            <CheckboxField
              label={"Non demandés"}
              state={statusParams.status.includes("AVAILABLE")}
              onChange={(ticked) =>
                setStatusParams((oldStatus) => ({
                  status: ticked
                    ? [...oldStatus.status, "AVAILABLE"]
                    : oldStatus.status.filter((x) => x !== "AVAILABLE"),
                }))
              }
            />
          </SidebarSection>
        </>
      }
    >
      <Container>
        <div className="d-flex align-items-center">
          <PageTitle>Gestion de la bibliothèque</PageTitle>
          <Link
            to={`/associations/${association.id}/bibliotheque/gestion/ajouter`}
            className={"btn btn-primary btn-sm ml-auto"}
          >
            <span className={"fe fe-plus"} /> Ajouter un objet
          </Link>
        </div>

        <Pagination
          apiMethod={api.loanables.list}
          apiKey={[
            "loanables.list",
            {
              library: association.id,
              page_size: 10,
              ordering: sortingToApiParameter(sorting),
              ...searchParams,
              ...statusParams,
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
