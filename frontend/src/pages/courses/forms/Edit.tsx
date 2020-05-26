import React, { useEffect, useContext, useState } from "react";
import { Form, Row, Col, Button, Modal, Container, Card, Spinner, ListGroup } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Field, Formik, useFormik, useField, FormikProps } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { useParams } from "react-router-dom";
import { Question } from "../../../models/courses/question";
import { Badge } from "reactstrap";


export const EditCourseForm = ({ course }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const newToast = useContext(ToastContext);

    useEffect(() => {
        api.courses.forms.questions
            .list(course.form)
            .then(questions => {
                setQuestions(questions);
                setIsLoading(false);
            })
            .catch(err => {
                newToast({
                    message: "Could not fetch questions...",
                    level: ToastLevel.Error,
                })
            })
    }, [])

    const addQuestion = () => {
        const newQuestion: Question = {
            label: "",
            required: true,
            archived: false,
            category: "R",
            form: course.form,
        };
        let copy = questions.slice();
        copy.push(newQuestion);
        setQuestions(copy);
    }

    if (isLoading) return <p>Chargement des cours</p>;

    return (
        <Container>
            <PageTitle>
                Cours

                    <FetchQuestionsModal course={course} />
            </PageTitle>

            <Row>
                {questions && questions.map(question =>
                    <Col sm={6} id={"Col" + question.id}>
                        <QuestionEditor question={question} />
                    </Col>
                )}
            </Row>

            <Button onClick={addQuestion}>
                Ajouter une question
            </Button>

        </Container>
    );
}

const FetchQuestionsModal = ({ course }) => {
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [forms, setForms] = useState<FormModel[]>([]);
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: { idForm: -1, questions: [] },
        validate: (values) => { return (values.questions.length == 0 ? { questions: "Empty" } : {}) },
        onSubmit: (values, { setSubmitting }) => {
            Promise.all(values.questions.map((question: Question) => {
                question.id = undefined;
                question.form = course.form;
                console.log(question.id);
                return (
                    api.courses.forms.questions
                        .save(question)
                        .then((question) => {
                            newToast({
                                message: `Could not insert question ${question.label}`,
                                level: ToastLevel.Success,
                            });
                        })
                        .catch((err) => {
                            newToast({
                                message: `Could not insert question ${question.label}`,
                                level: ToastLevel.Error,
                            });
                        })
                )
            }))
                .then((data) => {
                    setSubmitting(false);
                    setIsFetching(false);
                })
        }
    });

    useEffect(() => {
        api.courses.forms
            .list()
            .then(forms => {
                setForms(forms);
                setIsLoading(false);
            })
            .catch(err => {
                newToast({
                    message: "Could not fetch questions...",
                    level: ToastLevel.Error,
                })
            })
    }, [])

    useEffect(() => {
        setIsLoading(true);
        api.courses.forms
            .questions.list(formik.values.idForm)
            .then(questions => {
                formik.setErrors({})
                formik.setFieldValue("questions", questions)
                setIsLoading(false);
            })
            .catch(err => {
                formik.setErrors({ questions: "Could not fetch" })
                formik.setFieldValue("questions", [])
                setIsLoading(false);
                newToast({
                    message: "Could not fetch questions...",
                    level: ToastLevel.Error,
                })
            })
    }, [formik.values.idForm])


    return (
        <>
            <Button
                onClick={(e) => setIsFetching(true)}
                disabled={isFetching}
            >
                Récupérer d'un autre formulaire
            </Button>

            {isFetching &&
                <Modal
                    show={isFetching}
                    onHide={() => setIsFetching(false)}
                >
                    <Form onSubmit={formik.handleSubmit}>
                        <Modal.Header closeButton>
                            <Modal.Title>Récupération</Modal.Title>
                            {isLoading || formik.isSubmitting &&
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            }
                        </Modal.Header>

                        <Modal.Body>
                            <Form.Label>Source</Form.Label>
                            <Form.Control
                                as="select"
                                id="idForm"
                                name="idForm"
                                onChange={formik.handleChange}
                                value={formik.values.idForm}
                            >
                                <option selected value={-1}> -- Formulaire -- </option>
                                {forms.map((form) =>
                                    <option value={form.id} id={"option_form" + form.id}>{form.name}</option>
                                )}
                            </Form.Control>

                            <br />

                            <ListGroup as="ul" className="overflow-auto">
                                <ListGroup.Item active>
                                    Détails des questions
                        </ListGroup.Item>
                                {formik.values.questions.map((question: Question) => (
                                    <ListGroup.Item>
                                        <Badge variant="info">{question.category}</Badge>
                                        {question.label}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Modal.Body>

                        <Modal.Footer className="d-flex justify-content-around">
                            <Button variant="primary" type="submit" disabled={formik.isSubmitting}>Ajouter</Button>
                            <Button variant="secondary" onClick={() => setIsFetching(false)}>Fermer</Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            }
        </>
    )
}

enum QuestionStatus {
    Clear = "light",
    Modified = "primary",
    Error = "danger",
    NotValid = "warning",
    Submitting = "info",
    Success = "success",
}

export const QuestionEditor = ({ question }) => {
    const [status, setStatus] = useState<QuestionStatus>(QuestionStatus.Clear);
    const newToast = useContext(ToastContext);

    const onSubmit = (question, { setSubmitting }) => {
        setStatus(QuestionStatus.Submitting);

        api.courses.forms.questions
            .save(question)
            .then(res => {
                console.log("plop" + question.form)
                newToast({
                    message: `Updated questions ${res.label} for ${res.form}`,
                    level: ToastLevel.Success,
                });
                setSubmitting(false);
                setStatus(QuestionStatus.Success);
            })
            .catch(err => {
                newToast({
                    message: err.response.status + " " + err.response.data,
                    level: ToastLevel.Error,
                });
                setSubmitting(false);
                setStatus(QuestionStatus.Error);
            });
    }

    const validate = (question) => {
        if (question.label === "") {
            setStatus(QuestionStatus.NotValid);
            return { label: "Ne peut pas etre vide" };
        }
        return {};
    }

    return (
        <Formik
            id={"formik" + question.id}
            initialValues={question}
            validate={validate}
            onSubmit={onSubmit}
        >
            {(props: FormikProps<Question>) => {
                let isTouched = false;
                Object.keys(props.touched).forEach((key) => {
                    if (props.touched[key]) isTouched = true;
                });
                if (isTouched && status == QuestionStatus.Clear)
                    setStatus(QuestionStatus.Modified);

                return (
                    <Card
                        as={Form}
                        onSubmit={props.handleSubmit}
                        border={status}
                    >
                        <Card.Header>
                            <Form.Group>
                                <Form.Control
                                    placeholder="Intitulé"
                                    id="label"
                                    name="label"
                                    value={props.values.label}
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                />
                                {props.touched.label && props.errors.label &&
                                    <Form.Control.Feedback type="invalid">{props.errors.label}</Form.Control.Feedback>
                                }
                            </Form.Group>
                        </Card.Header>

                        <Card.Body>
                            {!question.id &&
                                <MyRadioField
                                    label="Catégorie"
                                    id={"category" + question.id}
                                    name="category"
                                    mapping={{ "Commentaire": "C", "Notation": "R" }}
                                    {...props}
                                />
                            }

                            <Form.Group>
                                <Form.Label>Paramètres</Form.Label>
                                <Form.Check
                                    type="switch"
                                    label="Obligatoire"
                                    id={"required" + question.id}
                                    name="required"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    checked={props.values.required}
                                />
                                <br />
                                <Form.Check
                                    type="switch"
                                    label="Activer"
                                    id={"archived" + question.id}
                                    name="archived"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    checked={props.values.archived}
                                />
                            </Form.Group>
                        </Card.Body>

                        <Card.Footer className="d-flex justify-content-around">
                            <Button type="submit" disabled={props.isSubmitting}>
                                Valider
                                {props.isSubmitting &&
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                }
                            </Button>
                            <Button onClick={props.handleReset}>Reset</Button>
                        </Card.Footer>
                    </Card>
                )
            }}
        </Formik >
    )
};

const MyRadioField = ({ label, mapping, ...props }) => {
    // @ts-ignore
    const [field, meta, helper] = useField(props);

    if (meta.touched && meta.error) return <p>{meta.error}</p>
    return (
        <Form.Group>
            <Form.Label>{label}</Form.Label>
            {Object.keys(mapping).map((key, value) =>
                <Form.Check
                    type="radio"
                    id={key + value}
                    label={key}
                    value={mapping[key]}
                    checked={field.value === mapping[key]}
                    onChange={() => helper.setValue(mapping[key])}
                />
            )}
        </Form.Group>
    );
};