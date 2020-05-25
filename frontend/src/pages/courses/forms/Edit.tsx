import React, { useContext } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form"
import { api, useBetterQuery } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { useParams } from "react-router-dom";


export const EditCourseForm = ({ course }) => {
    const { formId } = useParams<{formId: string}>();
    {/*  
    TODOs
    1. Fetch questions
    */}

    return (
        <p></p>
    )
}


export const PrefillItem = () => {
    return (
        <p>To be done</p>
    )
}