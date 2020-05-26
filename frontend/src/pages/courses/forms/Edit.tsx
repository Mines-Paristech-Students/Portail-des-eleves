import React, { useEffect, useContext, useState } from "react";
import { Form, Row, Col, Button, Modal, Container, Card, Spinner } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Formik, useFormik, useField, FormikProps } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { useParams } from "react-router-dom";
import { Question } from "../../../models/courses/question";


export const EditCourseForm = ({ course }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const newToast = useContext(ToastContext);

    useEffect(() => {
        api.courses
            .list_questions(course.id)
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
            id: -1,
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
            <PageTitle>Cours</PageTitle>

            <FetchQuestionsModal questions={questions} setQuestions={setQuestions} />

            <Row>
                {questions && questions.map(question =>
                    <Col sm={6}>
                        <QuestionEditor question={question} />
                    </Col>
                )}
            </Row>

            <Button
                onClick={addQuestion}
            >
                Ajouter une question
            </Button>

        </Container>
    );
}

const FetchQuestionsModal = ({ questions, setQuestions }) => {
    const [isFetching, setIsFetching] = useState<boolean>(true);
    const newToast = useContext(ToastContext);

    const formFormik = useFormik({
        initialValues: { idForm: undefined },
        validate: (values) => { return (values.idForm ? {} : { idForm: "Obligatoire" }) },
        onSubmit: (values) => {
        }
    });

    return (
        <>
            <Button
                onClick={(e) => setIsFetching(true)}
                disabled={isFetching}
            >
                Récupérer d'un autre formulaire
            </Button>

            <Modal
                show={isFetching}
                onHide={() => setIsFetching(false)}
            >
                <Modal.Header>
                    <Modal.Title>Récupération</Modal.Title>
                    <Form onSubmit={formFormik.handleSubmit}>
                        <Form.Label>Source</Form.Label>
                        <Form.Control
                            as="select"
                            id="idForm"
                            name="idForm"
                            onChange={formFormik.handleChange}
                            value={formFormik.values.idForm}
                        >
                            <option disabled selected> -- Formulaire -- </option>
                            <option value="plop">plop</option>
                            <option value="plip">plip</option>
                        </Form.Control>
                    </Form>
                </Modal.Header>

                <Modal.Body>
                    <p>{formFormik.values.idForm}</p>
                </Modal.Body>

            </Modal>
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

        api.courses
            .save(question)
            .then(res => {
                newToast({
                    message: `Updated questions ${question.label}`,
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
                        <Card.Title>
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
                        </Card.Title>

                        <Card.Body>
                            {question.id == -1 &&
                                <MyRadioField
                                    label="Catégorie"
                                    id={"category" + question.id}
                                    name="category"
                                    mapping={{ "Commentaire": "C", "Notation": "R" }}
                                    value={props.values.category}
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
                                    value={String(props.values.required)}
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                />
                                <Form.Check
                                    type="switch"
                                    label="Activer"
                                    id={"archived" + question.id}
                                    name="archived"
                                    value={String(props.values.archived)}
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                />
                            </Form.Group>
                        </Card.Body>

                        <Card.Footer>
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
                    onBlur={helper.setTouched(true)}
                />
            )}
        </Form.Group>
    );
};