import React from "react";
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
    // Today - 1.
    let minStartDate = new Date();

    return (
        <>
            <PageTitle>Créer un événement</PageTitle>
            <Card className="text-left">
                <Formik
                    initialValues={{
                        name: "",
                        description: "",
                        startsAt: dayjs().toDate(),
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
                                minStartDate,
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
                    onSubmit={(values) => console.log(values)}
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
