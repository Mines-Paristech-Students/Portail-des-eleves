import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { MutateRoleModal } from "./MutateRoleModal";
import { Role } from "../../../../models/associations/role";

export const EditRoleModal = ({
  role,
  show,
  onHide,
}: {
  role: Role | null;
  show: boolean;
  onHide: () => void;
}) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [update] = useMutation(api.roles.update, {
    onSuccess: () => {
      sendSuccessToast("Rôle modifié.");
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
  });

  if (role === null) {
    return null;
  }

  return (
    <MutateRoleModal
      version="edit"
      title={`Modifier le rôle de ${role.user.firstName}
                    ${role.user.lastName}`}
      show={show}
      initialValues={{
        role: role.role,
        rank: role.rank,
        startDate: role.startDate,
        endDate: role.endDate ? role.endDate : undefined,
        endDateEnabled: !!role.endDate,
        permissions: role.permissions,
      }}
      onSubmit={(values, { setSubmitting }) =>
        update(
          {
            roleId: role.id,
            role: {
              role: values.role,
              rank: values.rank,
              startDate: values.startDate,
              endDate:
                values.endDateEnabled && values.endDate ? values.endDate : null,
              permissions: values.permissions,
            },
          },
          {
            onSettled: () => {
              setSubmitting(false);
              onHide();
            },
          }
        )
      }
      onHide={onHide}
    />
  );
};
