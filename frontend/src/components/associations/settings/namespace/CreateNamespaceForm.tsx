import React, { useContext } from "react";
import { ToastContext } from "../../../utils/Toast";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { AxiosError } from "axios";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, Form, InputGroup } from "react-bootstrap";

export const CreateNamespaceForm = ({ association }) => {
  const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

  const [createNamespace] = useMutation(api.namespaces.create, {
    onSuccess: (response) => {
      queryCache.invalidateQueries(["association.namespaces.list"]);
      sendSuccessToast("Namespace ajouté");
    },
    onError: (errorAsUnknown) => {
      const error = errorAsUnknown as AxiosError;
      sendErrorToast(
        `Erreur. Merci de réessayer ou de contacter les administrateurs si cela persiste. ${error.message}`
      );
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
          <InputGroup className="d-flex flex-column flex-md-row">
            <Form.Control
              className="w-100"
              placeholder={"Nouveau namespace"}
              name={"namespaceName"}
              value={values.namespaceName}
              onChange={handleChange}
              isInvalid={
                (errors.namespaceName && touched.namespaceName) || false
              }
            />
            <InputGroup.Text>
              <Button type={"submit"} variant={"success"}>
                <span className="fe fe-plus" />
                Ajouter le namespace
              </Button>
            </InputGroup.Text>
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
