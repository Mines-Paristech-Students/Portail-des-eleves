import * as Yup from "yup";
import { Button, Form, InputGroup } from "react-bootstrap";
import { Formik } from "formik";
import React, { useContext } from "react";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";

export const ChangeNameForm = ({ namespace }) => {
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    return (
        <Formik
            onSubmit={(values) => {
                api.namespaces
                    .save({ id: namespace.id, name: values.name })
                    .then((res) => {
                        sendSuccessToast("Namespace sauvegardé.");
                    })
                    .catch(() => {
                        sendErrorToast("Erreur lors de la sauvegarde.");
                    });
            }}
            initialValues={{ name: namespace.name }}
            validationSchema={Yup.object({
                name: Yup.string()
                    .required("Ce champ est requis.")
                    .min(2, "Un namespace doit avoir au minimum 2 caractères"),
            })}
        >
            {({ values, handleChange, errors, touched, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            placeholder={"Nom du namespace"}
                            name={"name"}
                            value={values.name}
                            onChange={handleChange}
                            isInvalid={!!(errors.name && touched.name)}
                        />
                        <InputGroup.Append>
                            <Button type={"submit"} variant={"outline-success"}>
                                <span className="fe fe-save" />
                            </Button>
                        </InputGroup.Append>
                        {errors.name && touched.name && (
                            <Form.Control.Feedback type={"invalid"}>
                                {errors.name}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>
                </form>
            )}
        </Formik>
    );
};
