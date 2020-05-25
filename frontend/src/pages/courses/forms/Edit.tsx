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
            .questions(course.id)
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

export const QuestionEditor = ({ question }) => {

    return (
        <Formik
            initialValues={question}
            onSubmit={(values, actions) => { }}
        >
            {(props: FormikProps<Question>) =>
                <Card
                    as={Form}
                    onSubmit={props.handleSubmit}
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
                        <MyRadioField
                            label="Catégorie"
                            id="category"
                            name="category"
                            mapping={{ "Commentaire": "C", "Notation": "R" }}
                            value={props.values.category}
                            {...props}
                        />

                        <Form.Group className="d-flex justify-content-between">
                            <Row>
                                <Form.Label>Paramètres</Form.Label>
                            </Row>
                            <Row>
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
                            </Row>
                        </Form.Group>
                    </Card.Body>

                    <Card.Footer>
                        <Button type="submit">Valider</Button>
                    </Card.Footer>
                </Card>
            }
        </Formik >
    )
};

const MyRadioField = ({ label, mapping, ...props }) => {
    // @ts-ignore
    const [field, meta, helper] = useField(props);

    const setValue = (value) => {
        helper.setValue(value);
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