import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { api, useBetterQuery } from "../../../services/apiService";
import { Formik, useField } from "formik";

export const CreateCourseForm = () => {
    return (
        <PrefillItem></PrefillItem>
    )
}

export const EditCourseForm = ({ Form }) => {
    {/*  
    TODOs
    1. Fetch questions
    */}

    return (
        <PrefillItem></PrefillItem>
    )
}


export const PrefillItem = () => {
    const { data: forms, status, error } = useBetterQuery<FormModel[]>(
        "forms.list",
        api.courses.forms.list,
    );

    return (
        <Formik
            initialValues={{
                "formId": 0,
            }}
            onSubmit={(values, actions) => {
                {/* TODO */ }
            }}
        >
            {formik => (
                <Form onSubmit={formik.handleSubmit}>
                    <Form.Row>
                        <Col>
                            {status === "loading" &&
                                <Form.Control
                                    as="select"
                                    className="border border-warning"
                                    custom
                                >
                                </Form.Control>
                            }
                            {status === "error" &&
                                <Form.Control
                                    as="select"
                                    className="border border-danger"
                                    custom
                                >
                                </Form.Control>
                            }
                            {status === "success" &&
                                <Form.Control
                                    as="select"
                                    id="formId"
                                    value={formik.values.formId}                                    
                                    onChange={formik.handleChange}
                                    custom
                                >
                                    {forms?.map((form: FormModel) => (
                                        <option
                                            value={form.id}
                                        >
                                            {form.name}
                                        </option>
                                    ))}
                                </Form.Control>
                            }
                        </Col>

                        <Col>
                            <Button type="submit">Fetch</Button>
                        </Col>

                    </Form.Row>
                </Form>
            )}
        </Formik>
    )
}