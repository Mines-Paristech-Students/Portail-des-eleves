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
                <QuestionsForm questions={questions} />
            </Container>
        );
    }

    return null;
};

interface Values {
    ratings: {[key: number] : number};
    comments: {[key: number] : string};
}

export const QuestionsForm = ({ questions }) => {
    const newToast = useContext(ToastContext);
    // {questions.map(question => (
    //     <QuestionsForm questions={questions} />
    // ))}

    const initRating = ( questions : Question[] ) => {
        let base : Values = {
            ratings: {},
            comments: {},
        };
        for (let i in questions) {
            let question : Question = questions[i];
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

    const submitAnswers = (values, actions) => {

    }

    return (

        <Formik
            initialValues={initRating(questions)}
            onSubmit={submitAnswers}
        >
            {(props: FormikProps<Values>) => (
                <Card key={questions[0].id} className={"col-md-4 m-4"}>
                    <p>{props.values.ratings[0]}</p>
                    <Card.Body>
                        <Card.Title>{questions[0].label}</Card.Title>
                        <Form onSubmit={props.handleSubmit}>
                            {questions.map((question: Question) => 
                                <RatingField question={question} id={question.id} name="ratings" label="First Name" {...props} />
                            )}
                        </Form>
                    </Card.Body>
                </Card>
            )}
        </Formik>
    )
};

export const RatingField = ({ question, label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    const setValue = (value: number) => {
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
                    id={String(index)}
                    name={String(index)}
                    onClick={e => setValue(index + 1)}
                >
                    {(index < field.value[question.id])
                        ? <span className="text-dark">★</span>
                        : <span className="text-dark">☆</span>
                    }
                </Button>
            )}
            <p>{field.value[question.id]}</p>
        </Row>
    );
};