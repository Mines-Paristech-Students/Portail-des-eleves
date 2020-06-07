import * as Yup from "yup";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import { getRandom } from "../../../utils/random";

const titlePlaceholder = getRandom([
    "Exclusif : les comptes cachés du BDE",
    "Les 8 meilleurs ES pour gratter des ECTS",
    "Le Pipo, compétence transverse ou art de vivre ?",
    "Le top 10 des claqueurs de la Mine",
    "La DE : ils se dévoilent pour vous",
    "Le sombre secret derrière la Piche",
    "Comment éviter de devenir aigri après la 1A ?",
]);

/**
 * This component is used for creating or editing a page. It renders a form
 * in a `Card` component.
 *
 * @param title the title given to the card.
 * @param initialValues the values used to populate the form.
 * @param onSubmit called when the form is submitted.
 * @param onDelete optional. If specified, a Delete button is displayed and
 * bound to this callback.
 */
export const MutatePageForm = ({
    title,
    initialValues,
    onSubmit,
    onDelete = undefined,
}: {
    title: string;
    initialValues: {
        title?: string;
        text?: string;
    };
    onSubmit: (values, { resetForm, setSubmitting }) => any;
    onDelete?: () => any;
}) => (
    <Card>
        <Card.Header>
            <Card.Title>{title}</Card.Title>
        </Card.Header>

        <Formik
            initialValues={initialValues}
            validationSchema={Yup.object({
                title: Yup.string().required("Ce champ est requis."),
                text: Yup.string().required("Ce champ est requis."),
            })}
            onSubmit={(values, { resetForm, setSubmitting }) =>
                onSubmit(values, { resetForm, setSubmitting })
            }
        >
            <Form>
                <Card.Body>
                    <TextFormGroup
                        label="Titre"
                        name="title"
                        placeholder={titlePlaceholder}
                    />
                    <TextFormGroup
                        label="Description"
                        name="text"
                        placeholder="Votre article ici…"
                        as="textarea"
                        style={{
                            minHeight: "200px",
                        }}
                    />
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
    </Card>
);
