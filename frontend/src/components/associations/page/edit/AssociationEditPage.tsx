import { useHistory, useParams } from "react-router";
import { api, useBetterQuery } from "../../../../services/apiService";
import { Page } from "../../../../models/associations/page";
import { Loading } from "../../../utils/Loading";
import { Error } from "../../../utils/Error";
import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { Association } from "../../../../models/associations/association";
import { MutatePageForm } from "../MutatePageForm";
import { queryCache, useMutation } from "react-query";
import { AxiosError } from "axios";
import Container from "react-bootstrap/Container";

export const AssociationEditPage = ({
    association,
}: {
    association: Association;
}) => {
    const { sendInfoToast, sendSuccessToast, sendErrorToast } = useContext(
        ToastContext
    );

    const history = useHistory();
    const { pageId } = useParams<{ pageId: string }>();

    const { data: page, status, error } = useBetterQuery<Page>(
        ["page.get", pageId],
        api.pages.get
    );

    const [edit] = useMutation(api.pages.edit, {
        onMutate: () => sendInfoToast("Sauvegarde en cours…"),
        onSuccess: () => {
            sendSuccessToast("Page sauvegardée.");
            return queryCache
                .refetchQueries("pages.list")
                .then(() => queryCache.refetchQueries("pages.get"));
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            sendErrorToast(
                `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response
                        ? "Détails : " +
                          (error.response.status === 403
                              ? "vous n’avez pas le droit de modifier cette page."
                              : error.response.data.detail)
                        : ""
                }`
            );
        },
    });

    const [remove] = useMutation(api.pages.delete, {
        onMutate: () => sendInfoToast("Suppression en cours…"),
        onSuccess: () => {
            sendSuccessToast("Page supprimée.");
            return queryCache
                .refetchQueries("pages.list")
                .then(() => history.push(`/associations/${association.id}`));
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            sendErrorToast(
                `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response
                        ? "Détails : " +
                          (error.response.status === 403
                              ? "vous n’avez pas le droit de supprimer cette page."
                              : error.response.data.detail)
                        : ""
                }`
            );
        },
    });

    if (status === "loading") return <Loading />;
    else if (status === "error")
        return <Error detail={`Une erreur est survenue : ${error}`} />;
    else if (page)
        return (
            <Container className="mt-4">
                <MutatePageForm
                    title="Modifier une page"
                    initialValues={{
                        title: page.title,
                        text: page.text,
                    }}
                    onSubmit={(values, { setSubmitting }) =>
                        edit(
                            { id: pageId, ...values },
                            { onSettled: () => setSubmitting(false) }
                        )
                    }
                    onDelete={() =>
                        window.confirm(
                            "Êtes-vous sûr(e) de vouloir supprimer cette page ? Cette opération ne peut pas être annulée."
                        ) && remove(pageId)
                    }
                />
            </Container>
        );

    return null;
};
