import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";

export const NamespaceDeleteButton = ({ namespace }) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const [mutate] = useMutation(api.namespaces.delete, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["association.namespaces.list"]);
            sendSuccessToast("Namespace supprimé");
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            sendErrorToast(
                `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`
            );
        },
    });

    return (
        <span
            className={"fe fe-x text-danger"}
            onClick={() =>
                window.confirm("Supprimer le namespace ?") &&
                mutate(namespace.id)
            }
        />
    );
};
