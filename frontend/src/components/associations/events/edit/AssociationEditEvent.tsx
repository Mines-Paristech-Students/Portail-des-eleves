import React, { useContext, useState } from "react";
import { Association } from "../../../../models/associations/association";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
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
import { Button, Modal } from "react-bootstrap";

export const AssociationEditEvent = ({
    association,
}: {
    association: Association;
}) => {
    const { eventId } = useParams<{ eventId: string }>();

    const history = useHistory();
    const newToast = useContext(ToastContext);

    const [showModal, setShowModal] = useState(false);

    const { data: event, error, status } = useBetterQuery<Event>(
        ["events.get", { eventId }],
        api.events.get,
        { refetchOnWindowFocus: false }
    );

    const [edit] = useMutation(api.events.update, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["events.get"]);

            if (response.status === 200) {
                newToast({
                    message: "Événement modifié.",
                    level: ToastLevel.Success,
                });
            }
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;

            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response === undefined
                        ? ""
                        : "Détails : " + JSON.stringify(error.response.data)
                }`,
                level: ToastLevel.Error,
            });
        },
    });

    const [remove] = useMutation(api.events.delete, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["events.list"]);

            if (response.status === 204) {
                newToast({
                    message: "Événement supprimé.",
                    level: ToastLevel.Success,
                });
            }

            history.push(`/associations/${association.id}/evenements`);
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;

            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${
                    error.response === undefined
                        ? ""
                        : "Détails : " + JSON.stringify(error.response.data)
                }`,
                level: ToastLevel.Error,
            });
        },
    });

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
                <DeleteConfirmationModal
                    show={showModal}
                    handleHide={() => setShowModal(false)}
                    handleDelete={() => remove({ eventId: event.id })}
                />
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
                        onDelete={() => setShowModal(true)}
                    />
                </Card>
            </>
        );
    }

    return null;
};

const DeleteConfirmationModal = ({ show, handleHide, handleDelete }) => (
    <Modal show={show} onHide={handleHide}>
        <Modal.Header closeButton>
            <Modal.Title>Supprimer l’événement ?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            Êtes-vous sûr(e) de vouloir supprimer cet événement ? Cette action
            ne peut pas être annulée.
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleHide}>
                Annuler
            </Button>
            <Button variant="danger" onClick={handleDelete}>
                Supprimer
            </Button>
        </Modal.Footer>
    </Modal>
);
