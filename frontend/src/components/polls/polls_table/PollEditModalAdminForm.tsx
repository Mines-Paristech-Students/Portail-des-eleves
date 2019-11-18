import React from 'react';
import {Poll} from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import BootstrapForm from "react-bootstrap/Form";
import * as Yup from "yup";
import {Formik, Form, useFormikContext} from "formik";
import {TextFormGroup} from "../../utils/forms/TextFormGroup";
import {SelectGroupPills} from "../../utils/forms/SelectGroupPills";
import {DatePickerField} from "../../utils/forms/DatePickerField";

type Props = {
    poll: Poll,
    setPoll: (poll: Poll) => void,
    handleClose: () => void,
};

export function PollEditModalAdminForm(props: Props) {
    function StateField() {
        let items = new Map();

        items.set(
            "ACCEPTED",
            <span className="selectgroup-button selectgroup-button-icon">
                <i className="fe fe-check text-success"/> Accepter
            </span>
        );

        items.set(
            "REJECTED",
            <span className="selectgroup-button selectgroup-button-icon">
                <i className="fe fe-x text-danger"/> Refuser
            </span>
        );

        items.set(
            "REVIEWING",
            <span className="selectgroup-button selectgroup-button-icon">
                <i className="fe fe-eye text-warning"/> En attente
            </span>
        );

        return (
            <SelectGroupPills label="Statut"
                              name="state"
                              items={items}/>
        );
    }

    function AdminCommentField() {
        const {values} = useFormikContext();

        if (values.state === "REJECTED") {
            return (
                <TextFormGroup label="Commentaire"
                               name="adminComment"
                               type="text"
                               placeholder="Un commentaire ?"/>
            )
        }

        return null
    }

    function DateField() {
        const {values} = useFormikContext();

        if (values.state === "ACCEPTED") {
            return <DatePickerField label="Date de publication"
                                    name="publicationDate"/>
        }

        return null
    }

    return (
        <Formik
            initialValues={{
                state: props.poll.state,
                adminComment: props.poll.adminComment,
                publicationDate: props.poll.publicationDate,
            }}
            validationSchema={Yup.object({
                        publicationDate: Yup.date()
                            .min(new Date(Date.now()))
                            .required('Ce champ est requis.'),
                    })}
            onSubmit={(values, {setSubmitting}) => {
                console.log(values);
            }}
        >
            <Form>
                <Modal.Body>
                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Question</BootstrapForm.Label>
                        <p>{props.poll.question}</p>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Réponse 1</BootstrapForm.Label>
                        <p>{props.poll.choices[0].text}</p>
                    </BootstrapForm.Group>

                    <BootstrapForm.Group>
                        <BootstrapForm.Label>Réponse 2</BootstrapForm.Label>
                        <p>{props.poll.choices[1].text}</p>
                    </BootstrapForm.Group>

                    <StateField/>

                    <AdminCommentField/>

                    <DateField/>
                </Modal.Body>

                <Modal.Footer>
                    <Button className="btn-icon"
                            variant="outline-danger"
                            onClick={props.handleClose}>
                        Annuler
                    </Button>
                    <Button className="btn-icon"
                            variant="outline-success"
                            type="submit">
                        Valider
                    </Button>
                </Modal.Footer>
            </Form>
        </Formik>
    );
}
