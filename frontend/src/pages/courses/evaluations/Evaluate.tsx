import React, { useContext, useState } from "react";
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Form, Button, Col } from "react-bootstrap";
import { Question } from "../../../models/courses/question"
import { Course } from "../../../models/courses/course";
import { useField, Formik, FieldConfig, FormikProps } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { NONAME } from "dns";

export const EvaluateCourse = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        "courses.questions",
        api.courses.questions,
        course.id,
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    else if (status === "error") {
        return `Something went wrong: ${error}`;
    } else if (status === "success" && questions) {
        return (
            <Container>
                <PageTitle>Cours</PageTitle>
                <QuestionsForm questions={questions} />
            </Container>
        );
    }

    return null;
};

interface Values {
    ratings: { [key: number]: number };
    comments: { [key: number]: string };
}

export const QuestionsForm = ({ questions }) => {
    const newToast = useContext(ToastContext);
    // {questions.map(question => (
    //     <QuestionsForm questions={questions} />
    // ))}

    const initRating = (questions: Question[]) => {
        let base: Values = {
            ratings: {},
            comments: {},
        };
        for (let i in questions) {
            let question: Question = questions[i];
            if (question.category === 'R') {
                base.ratings[question.id] = -1;
            } else if (question.category === 'C') {
                base.comments[question.id] = "";
            } else {
                console.log("Got unexpected");
                console.log(question.category);
            }
        }

        return base;
    };

    const submitAnswers = (values, { setSubmitting }) => {
        {/* Function to change the form to json */ }
        setSubmitting(false);
    }

    const getQuestionById = (id: number) => {
        for (let i in questions) {
            if (questions[i].id === id) return questions[i];
        }
    };

    const validateComments = (comments, errors) => {
        for (let i in comments) {
            let question: Question = getQuestionById(parseInt(i));
            let comment: string = comments[i];
            if (question.required && (comment === "")) {
                errors[i] = `${question.label} missing required field`;
                newToast({
                    message: `La question intitulée : ${question.label} doit être remplit!`,
                    level: ToastLevel.Error,
                });
            }
        }
    }

    const validateRatings = (ratings, errors) => {
        for (let i in ratings) {
            let question: Question = getQuestionById(parseInt(i));
            let rating: number = ratings[i];
            if (question.required && (rating === -1)) {
                errors[i] = `${question.label} missing required field`;
                newToast({
                    message: `La question intitulée : ${question.label} doit être remplit!`,
                    level: ToastLevel.Error,
                });
            }
        }
    }

    const validate = (values) => {
        {/* Validate the data */ }
        const errors = {};
        validateRatings(values.ratings, errors);
        validateComments(values.comments, errors);
        return errors;
    }

    return (

        <Formik
            initialValues={initRating(questions)}
            onSubmit={submitAnswers}
            validate={validate}
        >
            {(props: FormikProps<Values>) => (
                <Form onSubmit={props.handleSubmit}>
                    {questions.map((question: Question) => {
                        let field: JSX.Element = <p>Error</p>;
                        if (question.category === "R") {
                            field = <RatingField question={question} id={question.id} name="ratings" label="First Name" {...props} />;
                        }
                        else if (question.category === "C") {
                            field = <CommentField question={question} id={question.id} name="comments" label="First Name" {...props} />;
                        };
                        return (
                            <Card key={questions.id} className={"col-md-4 m-4"}>
                                <Card.Body>
                                    <Card.Title>{question.label}</Card.Title>
                                    {field}
                                </Card.Body>
                            </Card>
                        )
                    })}
                    <Button type="submit" disabled={props.isSubmitting}>
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    )
};

export const RatingField = ({ question, label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    const setValue = (value) => {
        field.value[question.id] = value;
        helpers.setValue(field.value);
        console.log(field.value)
    };

    if (meta.touched && meta.error) return <p>{meta.error}</p>
    return (
        <Row>
            {Array.from(Array(5).keys()).map((index) =>
                <Button
                    className="btn-outline-light border-0 bg-white w-20"
                    style={{ maxWidth: 20 }}
                    onClick={_ => setValue(index + 1)}
                >
                    {(index < field.value[question.id])
                        ? <span className="text-dark">★</span>
                        : <span className="text-dark">☆</span>
                    }
                </Button>
            )}
        </Row>
    );
};


export const CommentField = ({ question, label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    const setValue = (value) => {
        field.value[question.id] = value;
        helpers.setValue(field.value);
        console.log(field.value)
    };

    if (meta.touched && meta.error) return <p>{meta.error}</p>
    return (
        <Form.Control
            as="textarea"
            rows={3}
            // @ts-ignore
            onChange={(e) => setValue(e.target.value)}
        />
    );
};