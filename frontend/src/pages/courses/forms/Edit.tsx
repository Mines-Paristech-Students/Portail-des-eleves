import React, { useEffect, useContext, useState } from "react";
import { Form, Row, Col, Button, Modal, Container, Card } from "react-bootstrap";
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

            {/* Fetch from another form */}

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
        if (question.label === "") return {label: "Ne peut pas etre vide"};
        return {};
    }

    return (
        <Formik
            initialValues={question}
            validate={validate}
            onSubmit={onSubmit}
        >
            {(props: FormikProps<Question>) => {
                let isTouched = false;
                Object.keys(props.touched).forEach((key) => {
                    if (props.touched[key]) isTouched = true;
                });
                if (isTouched && status != QuestionStatus.Submitting) setStatus(QuestionStatus.Modified);

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
                                    onChange={props.handleChange}
                                />
                            </Form.Group>
                        </Card.Title>

                        <Card.Body>
                            {question.id == -1 &&
                                <MyRadioField
                                    label="Catégorie"
                                    id="category"
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
                                    id="required"
                                    name="required"
                                    value={String(props.values.required)}
                                    onChange={props.handleChange}
                                />
                                <Form.Check
                                    type="switch"
                                    label="Activer"
                                    id="archived"
                                    name="archived"
                                    value={String(props.values.archived)}
                                    onChange={props.handleChange}
                                />
                            </Form.Group>
                        </Card.Body>

                        <Card.Footer>
                            <Button type="submit">Valider</Button>
                            <Button >Reset</Button>
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

    const setValue = (value) => {
        helper.setValue(value);
        helper.setTouched(true);
    };

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
                    onChange={() => setValue(mapping[key])}
                />
            )}
        </Form.Group>
    );
};