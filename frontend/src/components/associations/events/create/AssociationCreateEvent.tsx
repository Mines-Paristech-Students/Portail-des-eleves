import React, { useContext } from "react";
import { Association } from "../../../../models/associations/association";
import { PageTitle } from "../../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import { getRandom } from "../../../../utils/random";
import { DayTimePickerInputFormGroup } from "../../../utils/forms/DayTimePickerFormGroup";
import dayjs from "dayjs";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { AxiosError } from "axios";

const [namePlaceholder, descriptionPlaceholder, placePlaceholder] = getRandom([
    ["Passace", "Et glou, et glou, et glou", "Place du village"],
    ["Intégration", "C’est le WEIIIIII", "Croatie"],
    ["Amphi BDE", "C’était mieux avant.", "L208"],
    ["Amphi entreprise", "Disruptif et innovant.", "Salle des colonnes"],
    ["BALM", "Pâtes-fromage", "Jardin de la Mine"],
    ["Octo", "Jus de tomate en promotion", "FAO"],
]);

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

            console.log(error.response);

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
            <PageTitle>Créer un événement</PageTitle>
            <Card className="text-left">
                <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        startsAt: dayjs().add(1, "hour").toDate(),
                        endsAt: dayjs().add(4, "hour").toDate(),
                        place: "",
                    }}
                    validationSchema={Yup.object({
                        name: Yup.string().required("Ce champ est requis."),
                        description: Yup.string().required(
                            "Ce champ est requis."
                        ),
                        startsAt: Yup.date()
                            .min(
                                new Date(),
                                "L’événement doit commencer aujourd’hui ou dans le futur."
                            )
                            .required(
                                "Veuillez entrer une date au format JJ/MM/YYYY HH:mm."
                            ),
                        endsAt: Yup.date()
                            .when(
                                "startsAt",
                                (startsAt, schema) =>
                                    startsAt &&
                                    schema.min(
                                        startsAt,
                                        "La date de fin doit être après la date de début."
                                    )
                            )
                            .required(
                                "Veuillez entrer une date au format JJ/MM/YYYY HH:mm."
                            ),
                        place: Yup.string().required("Ce champ est requis."),
                    })}
                    onSubmit={(values) =>
                        create({
                            data: {
                                association: association.id,
                                ...values,
                            },
                        })
                    }
                >
                    <Form>
                        <Card.Body>
                            <TextFormGroup
                                label="Nom de l’événement"
                                name="name"
                                type="text"
                                placeholder={namePlaceholder}
                            />
                            <TextFormGroup
                                label="Description"
                                name="description"
                                type="text"
                                placeholder={descriptionPlaceholder}
                            />
                            <TextFormGroup
                                label="Endroit"
                                name="place"
                                type="text"
                                placeholder={placePlaceholder}
                            />

                            <Row>
                                <Col xs={12} md={6}>
                                    <DayTimePickerInputFormGroup
                                        label="Début de l’événement"
                                        name="startsAt"
                                    />
                                </Col>
                                <Col xs={12} md={6}>
                                    <DayTimePickerInputFormGroup
                                        label="Fin de l’événement"
                                        name="endsAt"
                                    />
                                </Col>
                            </Row>
                        </Card.Body>

                        <Card.Footer className="text-right">
                            <Button type="submit" variant="outline-success">
                                Envoyer
                            </Button>
                        </Card.Footer>
                    </Form>
                </Formik>
            </Card>
        </>
    );
};
