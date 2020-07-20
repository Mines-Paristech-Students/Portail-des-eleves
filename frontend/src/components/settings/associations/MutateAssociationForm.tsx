import React from "react";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import * as Yup from "yup";

export const MutateAssociationForm = ({
  initialValues,
  onSubmit,
  onDelete,
}: {
  initialValues: {
    name: string;
    rank?: number;
  };
  onSubmit: any;
  onDelete?: () => void;
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      name: Yup.string().required("Ce champ est requis."),
      rank: Yup.number()
        .integer("Le rang doit être un nombre entier.")
        .required("Ce champ est requis."),
    })}
    onSubmit={onSubmit}
  >
    <Form>
      <Card.Body>
        <TextFormGroup
          label="Nom de l’association"
          name="name"
          type="text"
          placeholder="Nom de l’association"
        />
        <TextFormGroup
          label="Rang"
          name="rank"
          type="number"
          help="Les associations avec le même rang seront triées par ordre alphabétique."
        />
      </Card.Body>

      <Card.Footer className="text-right">
        {onDelete && (
          <Button
            type="button"
            variant="outline-danger"
            onClick={onDelete}
            className="mr-2"
          >
            Supprimer
          </Button>
        )}
        <Button type="submit" variant="outline-success">
          Envoyer
        </Button>
      </Card.Footer>
    </Form>
  </Formik>
);
