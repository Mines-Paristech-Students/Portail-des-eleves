import React, { useContext } from "react";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";

export
const NamespaceDeleteButton = ({ namespace }) => {
    const newToast = useContext(ToastContext);

    const [mutate] = useMutation(api.namespaces.delete, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["association.namespaces.list"]);
            newToast({
                message: "Namespace supprimé",
                level: ToastLevel.Success,
            });
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`,
                level: ToastLevel.Error,
            });
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
