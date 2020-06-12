import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api, useBetterQuery } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { PageTitle } from "../../../utils/PageTitle";
import { Link, useHistory, useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { Event } from "../../../../models/associations/event";
import { LoadingAssociation } from "../../Loading";
import { Error } from "../../../utils/Error";
import { MutateEventForm } from "../MutateEventForm";
import { ForbiddenError } from "../../../utils/ErrorPage";

export const AssociationEditEvent = ({
    association,
}: {
    association: Association;
}) => {
    const { eventId } = useParams<{ eventId: string }>();

    const history = useHistory();
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    const { data: event, error, status } = useBetterQuery<Event>(
        ["events.get", { eventId }],
        api.events.get,
        { refetchOnWindowFocus: false }
    );

    const [edit] = useMutation(api.events.update, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["events.get"]);

            if (response.status === 200) {
                sendSuccessToast("Événement modifié.");
            }
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

    const [remove] = useMutation(api.events.delete, {
        onSuccess: () => {
            queryCache.refetchQueries(["events.list"]);
            sendSuccessToast("Événement supprimé.");

            history.push(`/associations/${association.id}/evenements`);
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

    if (!association.myRole?.permissions?.includes("event")) {
        return <ForbiddenError />;
    }

    if (status === "loading") {
        return <LoadingAssociation />;
    } else if (status === "error") {
        return <Error detail={error} />;
    } else if (event) {
        return (
            <>
                <PageTitle>
                    <Link
                        className="text-decoration-none"
                        to={`/associations/${association.id}/evenements`}
                        style={{ verticalAlign: "middle" }}
                    >
                        <i className="fe fe-arrow-left" />
                    </Link>{" "}
                    Modifier l’événement
                </PageTitle>
                <Card className="text-left">
                    <MutateEventForm
                        initialValues={event}
                        onSubmit={(values, { setSubmitting }) =>
                            edit(
                                {
                                    eventId: eventId,
                                    data: {
                                        association: association.id,
                                        ...values,
                                    },
                                },
                                {
                                    onSettled: setSubmitting(false),
                                }
                            )
                        }
                        onDelete={() =>
                            window.confirm(
                                "Êtes-vous sûr(e) de vouloir supprimer cet événement ? Cette opération ne peut pas être annulée."
                            ) && remove({ eventId: event.id })
                        }
                    />
                </Card>
            </>
        );
    }

    return null;
};
