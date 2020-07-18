import React from "react";
import { SettingsLayout } from "../SettingsLayout";
import { Table, useColumns } from "../../utils/table/Table";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import { Pagination } from "../../utils/Pagination";
import { api } from "../../../services/apiService";
import { sortingToApiParameter } from "../../utils/table/sorting";
import Tooltip from "react-bootstrap/Tooltip";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { Association } from "../../../models/associations/association";

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
      <OverlayTrigger
        placement={"bottom"}
        overlay={<Tooltip id="edit">Modifier l’association</Tooltip>}
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
        <Link to={`/parametres/associations/${association.id}/modifier`}>
          <Button className="btn-icon m-1" variant="outline-primary" size="sm">
            <i className="fe fe-edit-2" />
          </Button>
        </Link>
      </OverlayTrigger>
    ),
  },
];

export const SettingsAssociations = () => {
  const { columns, sorting } = useColumns(columnsData);

  return (
    <SettingsLayout>
      <Container>
        <PageTitle>Associations</PageTitle>{" "}
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
