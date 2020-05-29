import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import dayjs from "dayjs";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import { MutateEventForm } from "../MutateEventForm";

export const AssociationCreateEvent = ({
    association,
}: {
    association: Association;
}) => {
    const newToast = useContext(ToastContext);
    const [create] = useMutation(api.events.create, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["events.list"]);

            if (response.status === 201) {
                newToast({
                    message: "Événement créé.",
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
                Créer un événement
            </PageTitle>
            <Card className="text-left">
                <MutateEventForm
                    initialValues={{
                        name: "",
                        description: "",
                        startsAt: dayjs().add(1, "hour").toDate(),
                        endsAt: dayjs().add(4, "hour").toDate(),
                        place: "",
                    }}
                    onSubmit={(values, { resetForm, setSubmitting }) =>
                        create(
                            {
                                data: {
                                    association: association.id,
                                    ...values,
                                },
                            },
                            {
                                onSuccess: resetForm(),
                                onSettled: setSubmitting(false),
                            }
                        )
                    }
                />
            </Card>
        </>
    );
};
