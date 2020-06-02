import React from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { DayTimePickerInputFormGroup } from "../../utils/forms/DayTimePickerInputFormGroup";
import Button from "react-bootstrap/Button";
import { getRandom } from "../../../utils/random";

const [namePlaceholder, descriptionPlaceholder, placePlaceholder] = getRandom([
    ["Passace", "Et glou, et glou, et glou", "Place du village"],
    ["Intégration", "C’est le WEIIIIII", "Croatie"],
    ["Amphi BDE", "C’était mieux avant.", "L208"],
    ["Amphi entreprise", "Disruptif et innovant.", "Salle des colonnes"],
    ["BALM", "Pâtes-fromage", "Jardin de la Mine"],
    ["Octo", "Jus de tomate en promotion", "FAO"],
]);

/**
 * This component displays a form to edit or create an event.
 * Formik is used to manage the form's state. The validation is also handled by default.
 *
 * @param initialValues The initialValues to populate the form with.
 * @param onSubmit Called when the Submit button is hit. It is passed Formik's `values`, `resetForm` and `setSubmitting`.
 * @param onDelete Optional. If provided, display a Delete button and call this function when the button is clicked.
 */
export const MutateEventForm = ({
    initialValues,
    onSubmit,
    onDelete = undefined,
}: {
    initialValues: {
        name: string;
        description: string;
        startsAt: Date;
        endsAt: Date;
        place: string;
    };
    onSubmit: any;
    onDelete?: () => void;
}) => (
    <Formik
        initialValues={initialValues}
        validationSchema={Yup.object({
            name: Yup.string().required("Ce champ est requis."),
            description: Yup.string().required("Ce champ est requis."),
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
        onSubmit={(values, { resetForm, setSubmitting }) =>
            onSubmit(values, { resetForm, setSubmitting })
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
                    as="textarea"
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
                {onDelete && (
                    <Button
                        type="button"
                        variant="outline-danger"
                        onClick={onDelete}
                        className="mr-2"
                    >
                        Supprimer
                    </Button>
                )}
                <Button type="submit" variant="outline-success">
                    Envoyer
                </Button>
            </Card.Footer>
        </Form>
    </Formik>
);
