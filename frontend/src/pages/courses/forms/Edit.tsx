import React, { useContext } from "react";
import { Form, Row, Col, Button, Modal, Container } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { PageTitle } from "../../../utils/common";
import { api, useBetterQuery } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { useParams } from "react-router-dom";
import { Question } from "../../../models/courses/question";


export const EditCourseForm = ({ course }) => {
    const { data: questions, error, status } = useBetterQuery<Question[]>(
        "courses.questions",
        api.courses.questions,
        course.id,
    );

    if (status === "loading") return <p>Chargement des cours</p>;
    if (status === "error") return `Something went wrong: ${error}`;
    if (status === "success" && questions) {
        return (
            <Container>
                <PageTitle>Cours</PageTitle>

                {/* Fetch from another form */}

                <Row>
                    {questions.map(question =>
                        <QuestionEditor question={question} />
                    )}
                </Row>
            </Container>
        );
    }

    return <p>Not a single question yet</p>;
}

export const QuestionEditor = ({ question }) => {
    return (
        <p>{question.label}</p>
    )
}