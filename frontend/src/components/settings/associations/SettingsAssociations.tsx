import React from "react";
import { SettingsLayout } from "../SettingsLayout";
import { Table, useColumns } from "../../utils/table/Table";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { sortingToApiParameter } from "../../utils/table/sorting";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Association } from "../../../models/associations/association";
import { OverlayTriggerTooltip } from "../../utils/OverlayTriggerTooltip";

const columnsData = [
  {
    key: "rank",
    header: "Rang",
    canSort: true,
  },
  {
    key: "name",
    headerClassName: "w-50",
    header: "Nom",
    canSort: true,
  },
  {
    key: "action",
    header: "Action",
    render: (association: Association) => (
      <>
        <OverlayTriggerTooltip tooltip="Modifier l’association">
          <Link to={`/parametres/associations/${association.id}/modifier`}>
            <Button
              className="btn-icon m-1"
              variant="outline-primary"
              size="sm"
            >
              <i className="fe fe-edit-2" />
            </Button>
          </Link>
        </OverlayTriggerTooltip>
        <OverlayTriggerTooltip tooltip="Gérer les administrateurs(trices)">
          <Link
            to={`/parametres/associations/${association.id}/administrateurs`}
          >
            <Button
              className="btn-icon m-1"
              variant="outline-primary"
              size="sm"
            >
              <i className="fe fe-users" />
            </Button>
          </Link>
        </OverlayTriggerTooltip>
      </>
    ),
  },
];

export const SettingsAssociations = () => {
  const { columns, sorting } = useColumns(columnsData);

  return (
    <SettingsLayout>
      <Container>
        <div className="d-flex align-items-center">
          <PageTitle>Associations</PageTitle>
          <Link
            to={`/parametres/associations/creer`}
            className={"btn btn-outline-primary btn-sm float-right ml-auto"}
          >
            <span className="fe fe-plus" /> Créer
          </Link>
        </div>
        <Pagination
          apiKey={[
            "associations.list",
            { ordering: sortingToApiParameter(sorting) },
          ]}
          apiMethod={api.associations.list}
          render={(associations, paginationControl) => (
            <>
              <Card>
                <Table
                  columns={columns}
                  data={associations}
                  borderTop={false}
                />
              </Card>
              {paginationControl}
            </>
          )}
        />
      </Container>
    </SettingsLayout>
  );
};
