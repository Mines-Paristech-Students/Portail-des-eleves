import React, { useContext } from "react";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Form, InputGroup } from "react-bootstrap";

export const CreateNamespaceForm = ({ association }) => {
    const newToast = useContext(ToastContext);

    const [createNamespace] = useMutation(api.namespaces.create, {
        onSuccess: (response) => {
            queryCache.refetchQueries(["association.namespaces.list"]);
            newToast({
                message: "Namespace ajouté",
                level: ToastLevel.Success,
            });
        },
        onError: (errorAsUnknown) => {
            const error = errorAsUnknown as AxiosError;
            newToast({
                message: `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`,
                level: ToastLevel.Error,
            });
        },
    });

    return (
        <Formik
            onSubmit={(values) => {
                createNamespace({
                    name: values.namespaceName,
                    scoped_to_model: "association",
                    scoped_to_pk: association.id,
                });
            }}
            initialValues={{ namespaceName: "" }}
            validationSchema={Yup.object({
                namespaceName: Yup.string()
                    .required("Ce champ est requis.")
                    .min(2, "Un namespace doit avoir au minimum 2 caractères"),
            })}
        >
            {({ values, handleChange, errors, touched, handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                    <InputGroup>
                        <Form.Control
                            placeholder={"Nouveau namespace"}
                            name={"namespaceName"}
                            value={values.namespaceName}
                            onChange={handleChange}
                            isInvalid={
                                (errors.namespaceName &&
                                    touched.namespaceName) ||
                                false
                            }
                        />
                        <InputGroup.Append>
                            <Button type={"submit"} variant={"success"}>
                                <span className="fe fe-plus" />
                                Ajouter le namespace
                            </Button>
                        </InputGroup.Append>
                        {errors.namespaceName && touched.namespaceName && (
                            <Form.Control.Feedback type={"invalid"}>
                                {errors.namespaceName}
                            </Form.Control.Feedback>
                        )}
                    </InputGroup>
                </form>
            )}
        </Formik>
    );
};
