import React from "react";
import { getRandom } from "../../../../utils/random";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import { MarkdownFormGroup } from "../../../utils/forms/MarkdownFormGroup";

const [namePlaceholder, descriptionPlaceholder, commentPlaceholder] = getRandom(
  [
    [
      "Palum P12",
      "Pour les plus peigneurs des peignes",
      "Ne sert à rien après la refonte…",
    ],
    [
      "Machine à raclette",
      "Pour vos meilleures soirées",
      "Achetée en juin 2019",
    ],
    [
      "Morceau de faux plafond",
      "Très utile après l’interne",
      "5 € chez Bricorama",
    ],
  ]
);

/**
 * This component displays a form to edit or create a loanable.
 * Formik is used to manage the form's state. The validation is also handled by default.
 *
 * @param initialValues The initialValues to populate the form with.
 * @param onSubmit Called when the Submit button is hit. It is passed Formik's `values`, `resetForm` and `setSubmitting`.
 * @param onDelete Optional. If provided, display a Delete button and call this function when the button is clicked.
 */
export const MutateLoanableForm = ({
  initialValues,
  onSubmit,
  onDelete = undefined,
}: {
  initialValues: {
    name: string;
    description: string;
    comment: string;
  };
  onSubmit: any;
  onDelete?: () => void;
}) => (
  <Formik
    initialValues={initialValues}
    validationSchema={Yup.object({
      name: Yup.string().required("Ce champ est requis."),
      description: Yup.string(),
      comment: Yup.string(),
    })}
    onSubmit={(values, { resetForm, setSubmitting }) =>
      onSubmit(values, { resetForm, setSubmitting })
    }
  >
    <Form>
      <Card.Body>
        <TextFormGroup
          label="Nom de l’objet"
          name="name"
          type="text"
          placeholder={namePlaceholder}
        />
        <MarkdownFormGroup
          label="Description"
          name="description"
          type="text"
          placeholder={descriptionPlaceholder}
        />
        <MarkdownFormGroup
          label="Commentaire"
          help="Ce commentaire restera privé."
          name="comment"
          type="text"
          placeholder={commentPlaceholder}
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
