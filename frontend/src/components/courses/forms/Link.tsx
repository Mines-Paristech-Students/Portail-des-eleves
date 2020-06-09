import React, { useContext, useState } from "react";
import { Row, Col, Button, Modal, Card } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { api } from "../../../services/apiService";
import { ToastContext } from "../../utils/Toast";
import { Redirect } from "react-router-dom";
import { Pagination } from "../../utils/Pagination";


export const LinkCourseForm = ({ course }) => {
    const newToast = useContext(ToastContext);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);
    const [form, setForm] = useState<FormModel | null>(null);
    const [redirect, setRedirect] = useState<boolean>(false);

    const updateCourseForm = (form) => {
        course.form = form.id;

        api.courses
            .save(course)
            .then((_) => {
                setRedirect(true);
                newToast.sendSuccessToast(
                    "Successfully updated the course " + course.name
                );
            })
            .catch((err) => {
                newToast.sendErrorToast(
                    err.response.status + " " + err.response.data
                );
            });
    };

    if (redirect) return <Redirect to={`/cours/${course.id}`} />;

    return (
        <>
            <Row>
                <Pagination
                    apiKey={["api.courses.forms.list"]}
                    apiMethod={api.courses.forms.list}
                    render={(forms, paginationControl) =>
                        forms.map((form) =>  (
                                <>
                                    <Card
                                        md={4}
                                        border={form.id === course.form ? "info" : "light"}
                                        as={Col}
                                        className="m-2"
                                    >
                                        <Card.Header>
                                            <Card.Title>{form.name}</Card.Title>
                                        </Card.Header>
                                        <Card.Footer>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    setShowConfirm(true);
                                                    setForm(form);
                                                }}
                                            >
                                                Choisir
                                            </Button>
                                        </Card.Footer>
                                    </Card>
                                    {paginationControl}
                                </>
                            ))
                    }
                />
            </Row>

            <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Voulez-vous vraiment utiliser le formulaire {form?.name} ?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => updateCourseForm(form)}
                    >
                        Valider
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => setShowConfirm(false)}
                    >
                        Annuler
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
