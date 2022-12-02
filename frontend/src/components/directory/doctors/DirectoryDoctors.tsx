import React from "react";
import { DirectoryLayout } from "../DirectoryLayout";
import { PageTitle } from "../../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { Pagination } from "../../utils/Pagination";
import { sortingToApiParameter } from "../../utils/table/sorting";
import { Table, useColumns } from "../../utils/table/Table";
import { api } from "../../../services/apiService";
import { Card } from "react-bootstrap";
import { Doctor } from "../../../models/directory/doctor";
import { TagList, TaggableModel } from "../../utils/tags/TagList";

const columnsData = [
  {
    key: "name",
    header: "Nom",
    canSort: true,
  },
  {
    key: "tags",
    header: "Tags",
    render: (doctor: Doctor) => (
      <TagList
        model={TaggableModel.Doctor}
        instance={doctor}
        collapsed={true}
      />
    ),
  },
  {
    key: "address",
    header: "Adresse",
    headerClassName: "w-50",
    canSort: true,
  },
  {
    key: "phone",
    header: "Téléphone",
  },
  {
    key: "fee",
    header: "Honoraires",
    render: (doctor: Doctor) =>
      doctor.fee ? doctor.fee + " €" : "Pas de dépassement",
  },
];

export const DirectoryDoctors = () => {
  const { columns, sorting } = useColumns(columnsData);

  return (
    <DirectoryLayout>
      <Container>
        <div className="d-flex align-items-center">
          <PageTitle>Médecins</PageTitle>
        </div>
      </Container>
      <Pagination
        apiKey={[
          "associations.list",
          { ordering: sortingToApiParameter(sorting) },
        ]}
        apiMethod={api.directory.doctors.list}
        render={(doctors, paginationControl) => (
          <>
            <Card>
              <Table columns={columns} data={doctors} borderTop={false} />
            </Card>
            {paginationControl}
          </>
        )}
      />
    </DirectoryLayout>
  );
};
