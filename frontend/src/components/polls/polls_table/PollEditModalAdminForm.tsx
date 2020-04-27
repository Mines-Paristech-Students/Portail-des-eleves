import React, { useContext } from "react";
import { Poll } from "../../../models/polls";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Yup from "yup";
import { Formik, Form, useFormikContext } from "formik";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import { SelectGroup } from "../../utils/forms/SelectGroup";
import { DatePickerField } from "../../utils/forms/DatePickerField";
import { dateFormatter } from "../../../utils/format";
import { api } from "../../../services/apiService";
import { ToastContext, ToastLevel } from "../../../utils/Toast";

export const PollEditModalAdminForm = ({ poll, refetch, handleClose }: {
    poll: Poll,
    refetch: any,
    handleClose: () => void
}) => {
    const newToast = useContext(ToastContext);

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
            <SelectGroup
                type="pills"
                label="Statut"
                name="state"
                items={items}
            />
        );
    }

    function AdminCommentField() {
        const { values } = useFormikContext<any>();

        if (values.state === "REJECTED") {
            return (
                <TextFormGroup
                    label="Commentaire"
                    name="adminComment"
                    type="text"
                    placeholder="Un commentaire ?"
                />
            );
        }

        return null;
    }

    function DateField() {
        const { values } = useFormikContext<any>();

        if (values.state === "ACCEPTED") {
            return (
                <DatePickerField
                    label="Date de publication"
                    name="publicationDate"
                />
            );
        }

        return null;
    }

    let minDate = new Date();
    minDate.setDate(minDate.getDate() - 1);

    return (
        <Formik
            initialValues={{
                state: poll.state,
                adminComment: poll.adminComment,
                publicationDate: poll.publicationDate
            }}
            validationSchema={Yup.object({
                publicationDate: Yup.date()
                    .min(minDate, "Le sondage doit être publié aujourd’hui ou dans le futur.")
                    .when("state", {
                        is: "ACCEPTED",
                        then: Yup.date().required("Ce champ est requis."),
                        otherwise: Yup.date().notRequired()
                    })
            })}
            onSubmit={(values, { setSubmitting }) => {
                let data = {
                    state: values.state,
                    adminComment: values.state === "REJECTED" ? values.adminComment : "",
                    publicationDate: values.publicationDate
                };

                api.polls
                    .update(poll.id, data)
                    .then(response => {
                        if (response.status === 200) {
                            newToast({
                                message: "Sondage modifié.",
                                level: ToastLevel.Success
                            });
                        }
                    })
                    .catch(error => {
                        let message = "Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste.";
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
                        refetch({ force: true });
                    });
            }}
        >
            <Form>
                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Card className="mx-auto">
                                    <Card.Header>
                                        <Card.Title as="h3">{poll.question}</Card.Title>
                                    </Card.Header>
                                    <Card.Body>
                                        <Card.Subtitle>
                                            <em>
                                                Envoyé par {poll.user} le{" "}
                                                {poll.publicationDate &&
                                                dateFormatter(poll.publicationDate)}
                                                .
                                            </em>
                                        </Card.Subtitle>

                                        <span className="selectgroup-button">
                                            {poll.choices[0].text}
                                        </span>
                                        <span className="selectgroup-button">
                                            {poll.choices[1].text}
                                        </span>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col>
                                <StateField/>
                                <AdminCommentField/>
                                <DateField/>
                            </Col>
                        </Row>
                    </Container>
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
