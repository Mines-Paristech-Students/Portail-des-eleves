import * as Yup from "yup";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import React from "react";

export const MutateRepartitionForm = ({
  name,
  initialValues,
  onSubmit,
}: {
  name: string;
  initialValues: {
    name?: string;
  };
  onSubmit: (values, { resetForm, setSubmitting }) => any;
}) => (
  <Card>
    <Card.Header>
      <Card.Title>{name}</Card.Title>
    </Card.Header>

    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        name: Yup.string().required("Ce champ est requis."),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) =>
        onSubmit(values, { resetForm, setSubmitting })
      }
    >
      <Form>
        <Card.Body>
          <TextFormGroup label="Titre" name="name" placeholder="Modification" />
        </Card.Body>

        <Card.Footer className="text-right">
          <Button type="submit" variant="outline-success">
            Envoyer
          </Button>
        </Card.Footer>
      </Form>
    </Formik>
  </Card>
);
