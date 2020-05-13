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
                <Row>
                    {questions.map(question => (
                        <QuestionCard question={question} />
                    ))}
                </Row>
            </Container>
        );
    }

    return null;
};

interface Values {
    rating: number;
}

export const QuestionCard = ({ question }) => {
    const newToast = useContext(ToastContext);
    return (
        <Card key={question.id} className={"col-md-4 m-4"}>
            <Card.Body>
                <Card.Title>{question.label}</Card.Title>
                <Formik
                    initialValues={{
                        rating: 1,
                    }}
                    onSubmit={(values, actions) => {
                        newToast({
                            message: String(values.rating),
                            level: ToastLevel.Success
                        });
                    }}
                >
                    {(props: FormikProps<Values>) => (
                        <Form onSubmit={props.handleSubmit}>
                            <RatingField name="rating" label="First Name" {...props} />
                            <button type="submit" {...props} >Submit</button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
};

export const RatingField = ({ label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    console.log(Array.from(Array(5).keys()));

    if (meta.touched && meta.error) return <p>{meta.error}</p>
    return (
        <>
            <Row>
                {Array.from(Array(5).keys()).map((index) =>
                    <Button
                        className="btn-outline-light border-0 bg-white w-20"
                        style={{ maxWidth: 20 }}
                        id={String(index)}
                        name={String(index)}
                        onClick={e => helpers.setValue(index + 1)}
                    >
                        {(index < field.value)
                            ? <span className="text-dark">★</span>
                            : <span className="text-dark">☆</span>
                        }
                    </Button>
                )}
            </Row>
            <p>{field.value}</p>
        </>
    );
};