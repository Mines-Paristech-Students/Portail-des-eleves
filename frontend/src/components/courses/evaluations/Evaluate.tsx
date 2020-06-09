import React, { useContext, useState } from "react";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import { Redirect } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from "react-bootstrap";
import { Question } from "../../../models/courses/question";
import { useField, Formik, FormikProps } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Loading } from "../../utils/Loading";
import {
    Submission,
    EvalData,
    CommentSubmission,
    RatingSubmission,
} from "../../../models/courses/submission";
import { TablerColor } from "../../../utils/colors";
import { CardStatus } from "../../utils/CardStatus";

export const EvaluateCourse = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        ["courses.questions", course.form],
        api.courses.forms.questions.list
    );

    if (status === "loading") return <Loading />;
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

export const QuestionsForm = ({ questions, course }) => {
    const newToast = useContext(ToastContext);
    let [hasVoted, setHasVoted] = useState(false);

    const initRating = (questions: Question[]) => {
        let base: EvalData = {
            ratings: {},
            comments: {},
        };
        for (let i in questions) {
            let question: Question = questions[i];
            if (question.id) {
                if (question.category === "R") {
                    base.ratings[question.id] = -1;
                } else if (question.category === "C") {
                    base.comments[question.id] = "";
                }
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
        let data: Submission = {
            course: course.id,
            ratings: [],
            comments: [],
        };

        // Already checked by validation
        for (let id in values.comments) {
            if (values.comments[id] !== "") {
                const commentData: CommentSubmission = {
                    question: parseInt(id),
                    content: values.comments[id],
                };
                data.comments.push(commentData);
            }
        }
        for (let id in values.ratings) {
            if (values.ratings[id] !== -1) {
                const rating_data: RatingSubmission = {
                    question: parseInt(id),
                    value: values.ratings[id],
                };
                data.ratings.push(rating_data);
            }
        }

        api.courses
            .submit(course.id, data)
            .then((res) => {
                newToast.sendSuccessToast("A voté !");

                setSubmitting(false);
                setHasVoted(true);
            })
            .catch((err) => {
                newToast.sendSuccessToast(
                    err.response.status + " " + err.response.data
                );
            });
    };

    const validateComments = (comments, errors) => {
        for (let i in comments) {
            let question: Question = getQuestionById(i);
            let comment: string = comments[i];
            if (question.required && comment === "") {
                errors[i] = `${question.label} missing required field`;
                newToast.sendErrorToast(
                    `La question intitulée : ${question.label} doit être remplit!`
                );
            }
        }
    };

    const validateRatings = (ratings, errors) => {
        for (let i in ratings) {
            let question: Question = getQuestionById(i);
            let rating: number = ratings[i];
            if (question.required && rating === -1) {
                errors[i] = `${question.label} missing required field`;
                newToast.sendErrorToast(
                    `La question intitulée : ${question.label} doit être remplit!`
                );
            }
        }
    };

    const validate = (values) => {
        const errors = {};
        validateRatings(values.ratings, errors);
        validateComments(values.comments, errors);
        return errors;
    };

    if (hasVoted) return <Redirect to={`/cours/${course.id}`} />;
    return (
        <Row>
            <Formik
                initialValues={initRating(questions)}
                onSubmit={submitAnswers}
                validate={validate}
            >
                {(props: FormikProps<EvalData>) => (
                    <Form
                        className="d-flex justify-content-center"
                        onSubmit={props.handleSubmit}
                        as={Card}
                    >
                        {questions.map((question) => {
                            if (question.archived) return null;

                            let field: JSX.Element = <p>Error</p>;
                            if (question.category === "R") {
                                field = (
                                    <RatingField
                                        question={question}
                                        id={question.id}
                                        name="ratings"
                                        label="First Name"
                                        {...props}
                                    />
                                );
                            } else if (question.category === "C") {
                                field = (
                                    <CommentField
                                        question={question}
                                        id={question.id}
                                        name="comments"
                                        label="First Name"
                                        {...props}
                                    />
                                );
                            }

                            return (
                                <Form.Group className="p-3 text-center">
                                    <Form.Label>
                                        <h4>{question.label}</h4>
                                    </Form.Label>

                                    <Col sm={12} key={question.id}>
                                        <Card key={questions.id}>
                                            <CardStatus
                                                color={
                                                    props.errors[question.id]
                                                        ? TablerColor.Red
                                                        : question.required
                                                        ? TablerColor.Lime
                                                        : TablerColor.Gray
                                                }
                                            />
                                            {field}
                                        </Card>
                                    </Col>
                                </Form.Group>
                            );
                        })}
                        <Button type="submit" disabled={props.isSubmitting}>
                            Submit
                        </Button>
                    </Form>
                )}
            </Formik>
        </Row>
    );
};

export const RatingField = ({ question, label, ...props }) => {
    // @ts-ignore
    const [field, meta, helpers] = useField(props);

    const setValue = (value) => {
        field.value[question.id] = value;
        helpers.setValue(field.value);
    };

    if (meta.touched && meta.error) return <p>{meta.error}</p>;
    return (
        <Row className="d-flex justify-content-center">
            {Array.from(Array(5).keys()).map((index) => (
                <Button
                    className="btn-outline-light border-0 bg-white w-20"
                    style={{ maxWidth: 20 }}
                    onClick={(_) => setValue(index + 1)}
                >
                    {index < field.value[question.id] ? (
                        <span className="text-dark">★</span>
                    ) : (
                        <span className="text-dark">☆</span>
                    )}
                </Button>
            ))}
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

    if (meta.touched && meta.error) return <p>{meta.error}</p>;
    return (
        <Form.Control
            as="textarea"
            rows={3}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};
