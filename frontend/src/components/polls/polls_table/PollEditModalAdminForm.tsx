import React from 'react';
import {Poll} from "../../../models/polls";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import * as Yup from "yup";
import {Formik, Form, useFormikContext} from "formik";
import {TextFormGroup} from "../../utils/forms/TextFormGroup";
import {SelectGroup} from "../../utils/forms/SelectGroup";
import {DatePickerField} from "../../utils/forms/DatePickerField";
import {dateFormatter} from "../../../utils/format";

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
                <i className="fe fe-check text-success"/> Accepté
            </span>
        );

        items.set(
            "REJECTED",
            <span className="selectgroup-button selectgroup-button-icon">
                <i className="fe fe-x text-danger"/> Refusé
            </span>
        );

        items.set(
            "REVIEWING",
            <span className="selectgroup-button selectgroup-button-icon">
                <i className="fe fe-eye text-warning"/> En attente
            </span>
        );

        return (
            <SelectGroup type="pills"
                         label="Statut"
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
                <Card className="w-50 mx-auto mt-5 mb-2">
                    <Card.Header>
                        <Card.Title as="h3">{props.poll.question}</Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Card.Subtitle>
                            <em>Envoyé par 17TODO le {dateFormatter(props.poll.publicationDate)}.</em>
                        </Card.Subtitle>

                        <span className="selectgroup-button">
                            {props.poll.choices[0].text}
                        </span>
                        <span className="selectgroup-button">
                            {props.poll.choices[1].text}
                        </span>
                    </Card.Body>
                </Card>
                <Modal.Body>
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
