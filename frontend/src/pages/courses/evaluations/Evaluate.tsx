import React, { useContext, useState } from "react";
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { Redirect } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Question } from "../../../models/courses/question"
import { useField, Formik, FormikProps } from "formik";
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
                <QuestionsForm questions={questions} course={course} />
            </Container>
        );
    }

    return null;
};

interface Values {
    ratings: { [key: number]: number };
    comments: { [key: number]: string };
}


export const QuestionsForm = ({ questions, course }) => {
    const newToast = useContext(ToastContext);
    let [hasVoted, setHasVoted] = useState<boolean>(false);

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

    const getQuestionById = (id_: string) => {
        let id: number = parseInt(id_);
        for (let i in questions) {
            if (questions[i].id === id) return questions[i];
        }
    };

    const submitAnswers = (values, { setSubmitting }) => {
        interface Submission {
            course: any;
            ratings: any[];
            comments: any[];
        }

        let data: Submission = {
            course: course.id,
            ratings: [],
            comments: [],
        }

        // Already checked by validation
        for (let id in values.comments) {
            if (values.comments[id] != "") {
                const comment_data = {
                    question: id,
                    content: values.comments[id],
                }
                data.comments.push(comment_data);
            }
        }
        for (let id in values.ratings) {
            if (values.ratings[id] != -1) {
                const rating_data = {
                    question: id,
                    value: values.ratings[id],
                }
                data.ratings.push(rating_data);
            }
        }

        api.courses
            .submit(course.id, data)
            .then(res => {
                newToast({
                    message: "A voté !",
                    level: ToastLevel.Success,
                });

                setSubmitting(false);
                setHasVoted(true);
            })
            .catch(err => {
                newToast({
                    message: err.response.status + " " + err.response.data,
                    level: ToastLevel.Error,
                });
            });
    }

    const validateComments = (comments, errors) => {
        for (let i in comments) {
            let question: Question = getQuestionById(i);
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
            let question: Question = getQuestionById(i);
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

    if (hasVoted) return <Redirect to={`/cours/${course.id}`} />
    return (
        <Row>
            <Formik
                initialValues={initRating(questions)}
                onSubmit={submitAnswers}
                validate={validate}
            >
                {(props: FormikProps<Values>) => (
                    <Form onSubmit={props.handleSubmit}>
                        {questions.map((question: Question) => {
                            console.log(props.errors);
                            let field: JSX.Element = <p>Error</p>;
                            if (question.category === "R") {
                                field = <RatingField question={question} id={question.id} name="ratings" label="First Name" {...props} />;
                            }
                            else if (question.category === "C") {
                                field = <CommentField question={question} id={question.id} name="comments" label="First Name" {...props} />;
                            };

                            let bg = 'light';
                            if (props.errors[question.id] != undefined) bg = 'danger';

                            return (
                                <Col md={8} key={question.id}>
                                    <Card
                                        key={questions.id}
                                        className="col-md-4 m-4"
                                        text={bg === 'light' ? 'dark' : 'white'}
                                        // @ts-ignore
                                        bg={bg}
                                    >
                                        <Card.Header>{question.label}</Card.Header>
                                        <Card.Body>
                                            {field}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            )
                        })}
                        <Button type="submit" disabled={props.isSubmitting}>
                            Submit
                    </Button>
                    </Form>
                )
                }
            </Formik>
        </Row>

    )
};

export const RatingField = ({ question, label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    const setValue = (value) => {
        field.value[question.id] = value;
        helpers.setValue(field.value);
    };

    if (meta.touched && meta.error) return <p>{meta.error}</p>
    return (
        <Row className="d-flex justify-content-center">
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