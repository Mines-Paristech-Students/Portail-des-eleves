import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ToastContext } from "../../../utils/Toast";
import {
  api,
  useBetterPaginatedQuery,
  useBetterQuery,
} from "../../../../services/apiService";
import { Association } from "../../../../models/associations/association";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import { LoadingAssociation } from "../../../associations/Loading";
import { Error } from "../../../utils/Error";
import { PageTitle } from "../../../utils/PageTitle";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { SettingsLayout } from "../../SettingsLayout";
import { MutateAssociationForm } from "./MutateAssociationForm";
import { ConfirmDeleteModal } from "./ConfirmDeleteModal";
import { Role } from "../../../../models/associations/role";
import { ArrowLink } from "../../../utils/ArrowLink";

export const SettingsAssociationsEdit = () => {
  const { associationId } = useParams<{ associationId: string }>();

  const history = useHistory();
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const {
    data: association,
    error: associationError,
    status: associationStatus,
  } = useBetterQuery<Association>(
    ["associations.get", { associationId }],
    api.associations.get,
    { refetchOnWindowFocus: false }
  );

  const {
    resolvedData: adminRoles,
    error: adminRolesError,
    status: adminRolesStatus,
  } = useBetterPaginatedQuery<any>(
    [
      "roles.list",
      {
        association: associationId,
        permission: ["administration"],
        page_size: 100,
      },
      1,
    ],
    api.roles.list
  );

  const [edit] = useMutation(api.associations.update, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.get"]);
      sendSuccessToast("Association modifiée.");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails : " + JSON.stringify(error.response.data)
        }`
      );
    },
  });

  const [remove] = useMutation(api.associations.delete, {
    onSuccess: () => {
      queryCache.invalidateQueries(["associations.list"]);
      sendSuccessToast("Association supprimée.");
      history.push(`/parametres/associations`);
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;

      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
          error.response === undefined
            ? ""
            : "Détails : " + JSON.stringify(error.response.data)
        }`
      );
    },
  });

  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);

  return associationStatus === "loading" || adminRolesStatus === "loading" ? (
    <LoadingAssociation />
  ) : associationStatus === "error" ? (
    <Error detail={associationError} />
  ) : adminRolesStatus === "error" ? (
    <Error detail={adminRolesError} />
  ) : association && adminRoles ? (
    <SettingsLayout>
      <Container>
        <ConfirmDeleteModal
          association={association}
          onDelete={() => remove({ associationId: associationId })}
          show={showConfirmDeleteModal}
          onHide={() => setShowConfirmDeleteModal(false)}
        />
        <PageTitle>
          <ArrowLink to={`/parametres/associations`} />
          Modifier l’association
        </PageTitle>
        <MutateAssociationForm
          initialValues={{
            ...association,
            administrators: adminRoles.results.map((role: Role) => ({
              value: role.user.id,
              label: `${role.user.firstName} ${role.user.lastName}`,
            })),
          }}
          onSubmit={(values, { setSubmitting }) =>
            edit(
              {
                associationId: associationId,
                data: values,
              },
              {
                onSettled: setSubmitting(false),
              }
            )
          }
          onDelete={() => setShowConfirmDeleteModal(true)}
        />
      </Container>
    </SettingsLayout>
  ) : null;
};
