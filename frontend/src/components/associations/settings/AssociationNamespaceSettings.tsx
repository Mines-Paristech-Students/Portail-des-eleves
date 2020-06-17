import React from "react";
import { Card } from "react-bootstrap";
import { api } from "../../../services/apiService";
import { Pagination } from "../../utils/Pagination";
import { Table } from "../../utils/table/Table";
import { NamespaceDeleteButton } from "./namespace/NamespaceDeleteButton";
import { TagList } from "./namespace/TagList";
import { CreateNamespaceForm } from "./namespace/CreateNamespaceForm";
import { ChangeNameForm } from "./namespace/ChangeNameForm";

export const AssociationNamespaceSettings = ({ association }) => (
  <Card>
    <Card.Header>
      <Card.Title>Tags</Card.Title>
    </Card.Header>
    <Card.Body>
      <CreateNamespaceForm association={association} />
    </Card.Body>
    <Pagination
      apiKey={["association.namespaces.list", { association: association.id }]}
      apiMethod={api.namespaces.list}
      paginationControlProps={{
        className: "justify-content-center mt-5",
      }}
      render={(namespaces, paginationControl) => (
        <div className={"mt-3"}>
          <Table columns={columns} data={namespaces} showHeaders={false} />
          {paginationControl}
        </div>
      )}
    />
  </Card>
);

const columns = [
  {
    key: "name",
    header: "Nom",
    render: (namespace) => <ChangeNameForm namespace={namespace} />,
  },
  {
    key: "tags",
    header: "Tags",
    render: (namespace) => <TagList namespace={namespace} />,
  },
  {
    key: "actions",
    header: "",
    render: (namespace) => <NamespaceDeleteButton namespace={namespace} />,
    headerClassName: "text-right",
    cellClassName: "text-right",
  },
];
