import React, { useContext, useState } from "react";
import { Table, useColumns } from "../../../utils/table/Table";
import { SettingsLayout } from "../../SettingsLayout";
import Container from "react-bootstrap/Container";
import { PageTitle } from "../../../utils/PageTitle";
import { Link, useParams } from "react-router-dom";
import { Pagination } from "../../../utils/Pagination";
import { sortingToApiParameter } from "../../../utils/table/sorting";
import { api, useBetterQuery } from "../../../../services/apiService";
import Card from "react-bootstrap/Card";
import { OverlayTriggerTooltip } from "../../../utils/OverlayTriggerTooltip";
import Button from "react-bootstrap/Button";
import { ArrowLink } from "../../../utils/ArrowLink";
import { Role } from "../../../../models/associations/role";
import { ConfirmAdministratorRemovalModal } from "./ConfirmAdministratorRemovalModal";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import { Association } from "../../../../models/associations/association";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { ToastContext } from "../../../utils/Toast";

const columnsData = (associationId, setRoleToDelete) => [
  {
    key: "user__last_name",
    header: "Membre",
    canSort: true,
    render: (role: Role) => `${role.user.firstName} ${role.user.lastName}`,
  },
  {
    key: "action",
    header: "Action",
    render: (role: Role) => (
      <>
        <OverlayTriggerTooltip tooltip="Retirer">
          <Button
            type="button"
            variant="outline-danger"
            onClick={() => setRoleToDelete(role)}
            className="btn-icon m-1"
            size="sm"
          >
            <i className="fe fe-x" />
          </Button>
        </OverlayTriggerTooltip>
      </>
    ),
  },
];

export const SettingsAssociationsAdministrators = () => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  // Load the relevant association.
  const { associationId } = useParams<{ associationId: string }>();
  const { data: association, status, error } = useBetterQuery<Association>(
    ["associations.get", { associationId }],
    api.associations.get,
    { refetchOnWindowFocus: false }
  );

  // Mutation for removing the role. In fact, it updates the role by removing the
  // admin permission.
  const [remove] = useMutation(api.roles.update, {
    onSuccess: () => {
      sendSuccessToast("Administrateur(trice) retiré(e).");
      return queryCache.invalidateQueries(["roles.list"]);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response
            ? "Détails : " +
              (error.response.status === 403
                ? "vous n’avez pas le droit de modifier ce rôle."
                : error.response.data.detail)
            : ""
        }`
      );
    },
    onSettled: () => setRoleToRemove(undefined),
  });
  const handleRemove = (roleToRemove?: Role) => {
    if (roleToRemove) {
      return remove({
        roleId: roleToRemove.id,
        role: {
          permissions: roleToRemove.permissions.filter(
            (permission) => permission !== "administration"
          ),
        },
      });
    }
  };

  // If not undefined, the role used to display the AdministratorRemoval modal.
  const [roleToRemove, setRoleToRemove] = useState<Role | undefined>(undefined);

  const { columns, sorting } = useColumns(
    columnsData(associationId, setRoleToRemove)
  );

  return status === "loading" ? (
    <Loading />
  ) : status === "error" ? (
    <Error detail={error} />
  ) : status === "success" && association ? (
    <SettingsLayout>
      <ConfirmAdministratorRemovalModal
        association={association}
        role={roleToRemove}
        onRemove={() => handleRemove(roleToRemove)}
        show={roleToRemove !== undefined}
        onHide={() => setRoleToRemove(undefined)}
      />
      <Container>
        <div className="d-flex align-items-center">
          <PageTitle>
            <ArrowLink to={`/parametres/associations`} />
            Gérer les administrateur(trice)s de {association.name}
          </PageTitle>

          <Link
            to={`/parametres/associations/${associationId}/administrateurs/ajouter`}
            className={"btn btn-outline-primary btn-sm float-right ml-auto"}
          >
            <span className="fe fe-plus" /> Ajouter
          </Link>
        </div>
        <Pagination
          apiKey={[
            "roles.list",
            {
              association: associationId,
              permission: ["administration"],
              ordering: sortingToApiParameter(sorting),
            },
          ]}
          apiMethod={api.roles.list}
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
  ) : null;
};
