import React, { useContext, useState } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { api } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Redirect } from "react-router-dom";

export const CreateCourseForm = ({ course }) => {
  const [form, setForm] = useState<FormModel | null>(null);
  const [closed, setClosed] = useState<boolean>(false);

  const newToast = useContext(ToastContext);

  const formik = useFormik({
    initialValues: { name: "" },

    validate: (values) => {
      const errors: any = {};
      if (values.name === "") {
        errors.name = "Required";
        newToast.sendErrorToast("Le nom ne peut pas être vide !");
      }
      return errors;
    },

    onSubmit: (values) => {
      const form: FormModel = { name: values.name };

      api.courses.forms
        .save(form)
        .then((form) => {
          setForm(form);
          newToast.sendSuccessToast("Formulaire créé, redirection...");
        })
        .catch((err) => {
          newToast.sendErrorToast(
            err.response.status + " " + err.response.data
          );
        });
    },
  });

  if (form) return <Redirect to={`/cours/formulaires/${form.id}/editer`} />;
  if (closed) return <Redirect to={`/cours/formulaires/`} />;
  return (
    <Modal
      show={true}
      onHide={() => {
        setClosed(true);
      }}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Créer un nouveau formulaire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Label>Nom du formulaire :</Form.Label>
            <Form.Control
              id="name"
              name="name"
              onChange={formik.handleChange}
              value={formik.values.name}
            />
          </Form.Group>
          <Button type="submit">Valider</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
