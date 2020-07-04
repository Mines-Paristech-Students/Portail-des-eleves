import React, { useState, useContext } from "react";
import { Table, useColumns } from "../../../utils/table/Table";
import { Role } from "../../../../models/associations/role";
import { Pagination } from "../../../utils/Pagination";
import { api } from "../../../../services/apiService";
import { Association } from "../../../../models/associations/association";
import dayjs from "dayjs";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { sortingToApiParameter } from "../../../utils/table/sorting";
import Button from "react-bootstrap/Button";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { ForbiddenError } from "../../../utils/ErrorPage";
import { RolePermissionIconTooltip } from "./RolePermissionIconTooltip";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { EditRoleModal } from "./EditRoleModal";
import { CreateRoleModal } from "./CreateRoleModal";

const EditRoleButton = ({ handleClick }: { handleClick: () => void }) => (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 200, hide: 0 }}
    overlay={<Tooltip id="edit-button-tooltip">Modifier</Tooltip>}
  >
    <Button
      className="btn-icon m-1"
      variant="outline-primary"
      size="sm"
      onClick={handleClick}
    >
      <i className="fe fe-edit" />
    </Button>
  </OverlayTrigger>
);

const DeleteRoleButton = ({ handleClick }: { handleClick: () => void }) => (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 200, hide: 0 }}
    overlay={<Tooltip id="delete-button-tooltip">Supprimer</Tooltip>}
  >
    <Button
      className="btn-icon m-1"
      variant="outline-danger"
      size="sm"
      onClick={handleClick}
    >
      <i className="fe fe-trash-2" />
    </Button>
  </OverlayTrigger>
);

const columnData = (
  setEditRole: (role: Role) => void,
  remove: (roleId) => void
) => [
  {
    key: "member",
    header: "Membre",
    render: (role: Role) => [role.user.firstName, role.user.lastName].join(" "),
    canSort: true,
  },
  {
    key: "role",
    header: "Rôle",
    canSort: true,
  },
  {
    key: "startDate",
    header: "Début",
    render: (role: Role) => dayjs(role.startDate).format("DD/MM/YYYY"),
    canSort: true,
  },
  {
    key: "endDate",
    header: "Fin",
    render: (role: Role) =>
      role.endDate ? dayjs(role.endDate).format("DD/MM/YYYY") : "",
    canSort: true,
  },
  {
    key: "permissions",
    header: "Permissions",
    render: (role: Role) =>
      role.startDate > new Date() ? (
        <span className="text-muted small">Pas encore activées</span>
      ) : role.endDate && role.endDate <= new Date() ? (
        <span className="text-muted small">Expirées</span>
      ) : (
        <>
          {role.permissions.map((permission) => (
            <RolePermissionIconTooltip
              key={permission}
              permission={permission}
              iconProps={{ className: "mr-1" }}
            />
          ))}
        </>
      ),
  },
  {
    key: "actions",
    header: "Actions",
    render: (role: Role) => (
      <>
        <EditRoleButton handleClick={() => setEditRole(role)} />
        <DeleteRoleButton
          handleClick={() =>
            window.confirm(
              "Êtes-vous sûr(e) de supprimer ce rôle ? Cette opération ne peut pas être annulée !"
            ) && remove(role.id)
          }
        />
      </>
    ),
  },
];

export const AssociationRolesAdministration = ({
  association,
}: {
  association: Association;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  // The Role currently edited in the editing modal.
  const [editRole, setEditRole] = useState<Role | null>(null);

  const [showAddRole, setShowAddRole] = useState<boolean>(false);

  const [remove] = useMutation(api.roles.delete, {
    onSuccess: () => sendSuccessToast("Rôle supprimé."),
    onError: (response) =>
      sendErrorToast(
        `Une erreur est survenue: ${JSON.stringify((response as any).data)}.`
      ),
    onSettled: () => queryCache.invalidateQueries("roles.list"),
  });

  const { columns, sorting } = useColumns<Role>(
    columnData(setEditRole, remove)
  );

  if (!association.myRole?.permissions?.includes("administration")) {
    return <ForbiddenError />;
  }

  return (
    <>
      <EditRoleModal
        role={editRole}
        show={editRole !== null}
        onHide={() => setEditRole(null)}
      />
      <CreateRoleModal
        association={association}
        show={showAddRole}
        onHide={() => setShowAddRole(false)}
      />
      <Pagination
        apiMethod={api.roles.list}
        apiKey={[
          "roles.list",
          {
            association: association.id,
            ordering: sortingToApiParameter(sorting, {
              member: "user__last_name",
              role: "role",
              startDate: "start_date",
              endDate: "end_date",
            }),
          },
        ]}
        paginationControlProps={{
          className: "justify-content-center mt-5",
        }}
        render={(roles, paginationControl) => (
          <Container className="mt-4">
            <Row className="align-items-center mb-2">
              <Col sm="12" md="10">
                <PageTitle className="my-0">Gestion des rôles</PageTitle>
              </Col>
              <Col sm="12" md="2">
                <Button
                  type="button"
                  variant="outline-primary"
                  className="float-sm-none float-md-right btn-sm"
                  onClick={() => setShowAddRole(true)}
                >
                  Ajouter un rôle
                </Button>
              </Col>
            </Row>

            <Card>
              <Table columns={columns} data={roles} />
              {paginationControl}
            </Card>
          </Container>
        )}
      />
    </>
  );
};
