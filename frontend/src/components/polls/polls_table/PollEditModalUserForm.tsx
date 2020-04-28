import React, { useContext } from "react";
import { Poll } from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import * as Yup from "yup";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const PollEditModalUserForm = ({
    poll,
    refetch,
    handleClose
}: {
    poll: Poll;
    refetch: any;
    handleClose: () => void;
}) => {
    const newToast = useContext(ToastContext);

    const onSubmit = (values, { setSubmitting }) => {
        let data = {
            question: values.question,
            choice0: values.choice0,
            choice1: values.choice1
        };

        api.polls
            .update(poll.id, data)
            .then(response => {
                if (response.status === 200) {
                    newToast({
                        message: "Sondage modifié.",
                        level: ToastLevel.Success
                    });
                    refetch({ force: true });
                }
            })
            .catch(error => {
                let message =
                    "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";
                let detail = error.response.data.detail;

                if (detail === "You are not allowed to update this poll.") {
                    detail = "Vous n’avez pas le droit de modifier ce sondage.";
                }

                newToast({
                    message: `${message} Détails : ${detail}`,
                    level: ToastLevel.Error
                });
            })
            .then(() => {
                setSubmitting(false);
                handleClose();
            });
    };

    return (
        <Formik
            initialValues={{
                question: poll.question,
                choice0: poll.choices[0].text,
                choice1: poll.choices[1].text
            }}
            validationSchema={Yup.object({
                question: Yup.string().required("Ce champ est requis."),
                choice0: Yup.string().required("Ce champ est requis."),
                choice1: Yup.string().required("Ce champ est requis.")
            })}
            onSubmit={onSubmit}
        >
            <Form>
                <Modal.Body>
                    <TextFormGroup
                        label="Question"
                        name="question"
                        type="text"
                    />
                    <TextFormGroup label="Choix 1" name="choice0" type="text" />
                    <TextFormGroup label="Choix 2" name="choice1" type="text" />
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="btn-icon"
                        variant="outline-danger"
                        onClick={handleClose}
                    >
                        Annuler
                    </Button>
                    <Button
                        className="btn-icon"
                        variant="outline-success"
                        type="submit"
                    >
                        Valider
                    </Button>
                </Modal.Footer>
            </Form>
        </Formik>
    );
};
