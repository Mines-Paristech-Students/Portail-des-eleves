import React from "react";
import Row from "react-bootstrap/Row";
import { RepartitionsHome } from "./Home";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { TextFormGroup } from "../utils/forms/TextFormGroup";
import { PageTitle } from "../utils/PageTitle";

const [
  repartiontitlePlaceholder,
  groupsnumberPlaceholder,
  studentnumberPlaceholder,
] = ["The Répartition", "2", "12"];

export const NewRepartition = ({ children }: { children?: any }) => {
  const onSave = (val) => {
    console.log("Edited Value -> ", val);
  };
  const onSubmit = (values, { resetForm, setSubmitting }) => {};

  return (
    <RepartitionsHome>
      <PageTitle>Nouvelle répartition</PageTitle>
      <Row>
        <Card className="text-left">
          <Formik
            initialValues={{
              repartiontitle: "",
              groupsnumber: "",
              studentnumber: "",
            }}
            validationSchema={Yup.object({
              repartiontitle: Yup.string().required("Ce champ est requis."),
              groupsnumber: Yup.string()
                .max(2)
                .required("Ce champ est requis."),
              studentnumber: Yup.string()
                .max(3)
                .required("Ce champ est requis."),
            })}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Card.Body>
                  <TextFormGroup
                    label="Sujet"
                    name="repartiontitle"
                    type="text"
                    placeholder={repartiontitlePlaceholder}
                  />
                  <TextFormGroup
                    label="Nombre de groupes"
                    name="groupsnumber"
                    type="number"
                    placeholder={groupsnumberPlaceholder}
                  />
                  <TextFormGroup
                    label="Nombre d'élèves"
                    name="studentnumber"
                    type="number"
                    placeholder={studentnumberPlaceholder}
                  />
                </Card.Body>
                <Card.Footer className="text-right">
                  <Button type="submit" variant="outline-success">
                    Créer
                  </Button>
                </Card.Footer>
              </form>
            )}
          </Formik>
        </Card>
      </Row>
      <Row>{children}</Row>
    </RepartitionsHome>
  );
};
