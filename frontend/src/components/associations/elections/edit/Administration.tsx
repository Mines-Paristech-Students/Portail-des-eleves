import { Election } from "../../../../models/associations/election";
import { Card, Col, Row, Button } from "react-bootstrap";
import React from "react";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import * as Yup from "yup";
import { DayTimePickerInputFormGroup } from "../../../utils/forms/DayTimePickerInputFormGroup";

export const Administration = ({ election }: { election: Election }) => {
  return (
    <Formik
      initialValues={election}
      onSubmit={(values, action) => console.log(values)}
      validationSchema={electionSchema}
    >
      <Form>
        <Card>
          <Card.Header>
            <Card.Title>Paramètres</Card.Title>
          </Card.Header>
          <Card.Body>
            <TextFormGroup
              name={"name"}
              label={"Intitulé de l'élection"}
              placeholder={"Nouvelle éléction"}
            />
            <Row>
              <Col md={6}>
                <DayTimePickerInputFormGroup
                  name={"startsAt"}
                  label={"Date de début"}
                />
              </Col>
              <Col md={6}>
                <DayTimePickerInputFormGroup
                  name={"endsAt"}
                  label={"Date de fin"}
                />
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer>
            <Button
              type={"submit"}
              variant={"success"}
              className={"float-right"}
            >
              <i className="fe fe-save" /> Enregister
            </Button>
          </Card.Footer>
        </Card>
      </Form>
    </Formik>
  );
};

const electionSchema = Yup.object().shape({
  name: Yup.string().min(2, "Trop court").required("Champ requis"),
  startsAt: Yup.date().min(new Date(), "Le vote doit commencer dans le futur"),
  endsAt: Yup.date().when(
    "startsAt",
    (startAt, schema) =>
      startAt && schema.min(startAt, "La fin du vote doit être après le début")
  ),
});
