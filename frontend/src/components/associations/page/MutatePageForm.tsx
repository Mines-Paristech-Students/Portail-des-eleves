import * as Yup from "yup";
import { Form, Formik } from "formik";
import Card from "react-bootstrap/Card";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import Button from "react-bootstrap/Button";
import React from "react";
import { getRandom } from "../../../utils/random";
import { MarkdownFormGroup } from "../../utils/forms/MarkdownFormGroup";
import { SelectFormGroup } from "../../utils/forms/SelectFormGroup";

const titlePlaceholder = getRandom([
  "Exclusif : les comptes cachés du BDE",
  "Les 8 meilleurs ES pour gratter des ECTS",
  "Le Pipo, compétence transverse ou art de vivre ?",
  "Le top 10 des claqueurs de la Mine",
  "La DE : ils se dévoilent pour vous",
  "Le sombre secret derrière la Piche",
  "Comment éviter de devenir aigri après la 1A ?",
]);

/**
 * This component is used for creating or editing a page. It renders a form
 * in a `Card` component.
 *
 * @param initialValues the values used to populate the form.
 * @param onSubmit called when the form is submitted.
 * @param onDelete optional. If specified, a Delete button is displayed and
 * bound to this callback.
 */
export const MutatePageForm = ({
  initialValues,
  onSubmit,
  onDelete = undefined,
}: {
  initialValues: {
    title?: string;
    text?: string;
    pageType?: string;
  };
  onSubmit: (values, { resetForm, setSubmitting }) => any;
  onDelete?: () => any;
}) => (
  <Card>
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object({
        title: Yup.string().required("Ce champ est requis."),
        text: Yup.string().required("Ce champ est requis."),
        pageType: Yup.string()
          .oneOf(["NEWS", "STATIC"])
          .required("Ce champ est requis."),
      })}
      onSubmit={(values, { resetForm, setSubmitting }) =>
        onSubmit(values, { resetForm, setSubmitting })
      }
    >
      <Form>
        <Card.Body>
          <SelectFormGroup
            label="Type de page"
            name={"pageType"}
            items={[
              { value: "NEWS", text: "Brève" },
              { value: "STATIC", text: "Classique" },
            ]}
            type={"radio"}
            selectType={"inline"}
          />
          <TextFormGroup
            label="Titre"
            name="title"
            placeholder={titlePlaceholder}
          />
          <MarkdownFormGroup
            label="Texte"
            name="text"
            placeholder="Votre article ici…"
            as="textarea"
            style={{
              minHeight: "200px",
            }}
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
            Sauvegarder
          </Button>
        </Card.Footer>
      </Form>
    </Formik>
  </Card>
);
