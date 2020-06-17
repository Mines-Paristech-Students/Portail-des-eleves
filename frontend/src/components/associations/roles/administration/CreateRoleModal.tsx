import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { MutateRoleModal } from "./MutateRoleModal";
import { Association } from "../../../../models/associations/association";

export const CreateRoleModal = ({
    association,
    show,
    onHide,
}: {
    association: Association;
    show: boolean;
    onHide: () => void;
}) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [create] = useMutation(api.roles.create, {
        onSuccess: () => {
            queryCache.refetchQueries(["roles.list"]);
            sendSuccessToast("Rôle créé.");
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            sendErrorToast(
                `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response
                        ? "Détails : " +
                          (error.response.status === 403
                              ? "vous n’avez pas le droit de créer de rôle."
                              : error.response.data.detail)
                        : ""
                }`
            );
        },
    });

    return (
        <MutateRoleModal
            version="create"
            title={`Créer un rôle`}
            show={show}
            initialValues={{
                user: undefined,
                role: "",
                rank: 0,
                startDate: new Date(),
                endDate: undefined,
                endDateEnabled: false,
                permissions: [],
            }}
            onSubmit={(values, { setSubmitting }) => {
                create(
                    {
                        role: {
                            association: association.id,
                            user: values.user && values.user.value,
                            role: values.role,
                            rank: values.rank,
                            startDate: values.startDate,
                            endDate:
                                values.endDateEnabled && values.endDate
                                    ? values.endDate
                                    : null,
                            permissions: values.permissions,
                        },
                    },
                    {
                        onSettled: () => {
                            setSubmitting(false);
                            onHide();
                        },
                    }
                );
            }}
            onHide={onHide}
        />
    );
};
