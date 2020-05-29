
import React, { useContext, useState } from "react";
import { Form, Row, Col, Button, Modal, Card } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { api, useBetterQuery } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { Redirect } from "react-router-dom";
import { setServers } from "dns";

export const CreateCourseForm = ({ course }) => {
    const [form, setForm] = useState<FormModel | null>(null);
    const [closed, setClosed] = useState<boolean>(false);

    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: { name: "" },

        validate: (values) => {
            const errors: any = {};
            if (values.name === "") {
                errors.name = "Required";
                newToast({
                    message: "Le nom ne peut pas être vide !",
                    level: ToastLevel.Error,
                });
            }
            return errors;
        },

        onSubmit: (values) => {
            const form : FormModel = {name : values.name};

            api.courses.forms
                .save(form)
                .then(form => {
                    setForm(form);
                    newToast({
                        message: "Formulaire créé, redirection...",
                        level: ToastLevel.Success,
                    });
                })
                .catch(err => {
                    newToast({
                        message: err.response.status + " " + err.response.data,
                        level: ToastLevel.Error,
                    });
                });
        }
    })

    if (form) return <Redirect to={`/cours/${course.id}/formulaires/${form.id}/editer`} />;
    if (closed) return <Redirect to={`/cours/${course.id}`} />;
    return (
        <Modal
            show={true}
            onHide={() => { setClosed(true) }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    Créer un nouveau formulaire
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Group>
                        <Form.Label>Nom du formulaire :</Form.Label>
                        <Form.Control
                            id="name"
                            name="name"
                            onChange={formik.handleChange}
                            value={formik.values.name}
                        />
                    </Form.Group>
                    <Button type="submit" >
                        Valider
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    )
}

export const LinkCourseForm = ({ course }) => {
    const newToast = useContext(ToastContext);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [form, setForm] = useState<FormModel | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);

    const { data: forms, error, status } = useBetterQuery<FormModel[]>(
        ["courses.forms.list"],
        api.courses.forms.list,
    );

    const updateCourseForm = (form) => {
        const data = {
            "id": course.id,
            "form": form.id,
        }

        api.courses
            .save(data)
            .then(_ => {
                setRedirect(true);
                newToast({
                    message: "Successfully updated the course " + course.name,
                    level: ToastLevel.Success,
                });
            })
            .catch(err => {
                newToast({
                    message: err.response.status + " " + err.response.data,
                    level: ToastLevel.Error,
                });
            })
    }

    if (redirect) return <Redirect to={`/cours/${course.id}`} />;

    if (status == "loading") return <p>Loading</p>
    if (status == "error") return <p>Erreur</p>

    return (
        <>
            <Row>
                {forms &&
                    forms.map((form) => {
                        let bg = "light";
                        if (form.id == course.form) bg = "info";

                        return (
                            <Col
                                md={4}
                                bg={bg}
                                as={Card}
                                className="m-2"
                            >
                                <Card.Header>
                                    <Card.Title>{form.name}</Card.Title>
                                </Card.Header>
                                <Card.Footer>
                                    <Button 
                                        variant="primary"
                                        onClick={() => { setShowConfirm(true); setForm(form); }} 
                                    >
                                        Choisir
                                    </Button>
                                </Card.Footer>
                                
                            </Col>
                        )
                    }
                    )}
            </Row >

            <Modal
                show={showConfirm}
                onHide={() => setShowConfirm(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment utiliser le formulaire {form?.name} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => updateCourseForm(form)}>Valider</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Annuler</Button>
                </Modal.Footer>
            </Modal>

        </>
    )
}