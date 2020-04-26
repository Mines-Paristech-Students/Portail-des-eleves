import React from "react";
import { Poll } from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import * as Yup from "yup";

export const PollEditModalUserForm = ({ poll, refetch, handleClose }: {
    poll: Poll,
    refetch: any,
    handleClose: () => void
}) => {
    return <Formik
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
        onSubmit={(values, { setSubmitting }) => {
            console.log(values);
        }}
    >
        <Form>
            <Modal.Body>
                <TextFormGroup
                    label="Question"
                    name="question"
                    type="text"
                />
                <TextFormGroup label="Choix 1" name="choice0" type="text"/>
                <TextFormGroup label="Choix 2" name="choice1" type="text"/>
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
    </Formik>;
};
