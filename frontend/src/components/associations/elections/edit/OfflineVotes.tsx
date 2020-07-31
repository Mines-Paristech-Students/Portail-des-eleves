import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Election } from "../../../../models/associations/election";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import * as Yup from "yup";
import { api } from "../../../../services/apiService";

export const OfflineVotes = ({ election }: { election: Election }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  return (
    <Formik
      initialValues={election.choices
        .map((choice) => ({
          id: choice.id,
          value: choice.numberOfOfflineVotes,
        }))
        .reduce((acc, cur) => ({ ...acc, [cur.id]: cur.value }), {})}
      validationSchema={Yup.object(
        election.choices.reduce(
          (acc, cur) => ({
            ...acc,
            [cur.id]: Yup.number()
              .required("Ce champ est requis.")
              .min(0, "Au minimum il y a 0 vote par choix."),
          }),
          {}
        )
      )}
      onSubmit={(values) => {
        setMessage("Envoi en cours");
        setStatus("loading");
        Promise.all(
          Object.entries(values).map(([id, value]) =>
            api.elections.choices.update({
              id: id,
              numberOfOfflineVotes: value,
            })
          )
        )
          .then(() => {
            setMessage("Votes enregistrés");
            setStatus("success");
          })
          .catch((err) => {
            setMessage(`Erreur : ${err.toString()}`);
            setStatus("error");
          });
      }}
    >
      <Form>
        <Card>
          <Card.Header>
            <Card.Title>Décompte des votes en bureau</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              {election.choices.map((choice) => (
                <Col md={6} key={choice.id}>
                  <TextFormGroup
                    name={choice.id}
                    label={choice.name}
                    type={"number"}
                  />
                </Col>
              ))}
            </Row>
          </Card.Body>
          <Card.Footer>
            <p
              className={`float-left pt-1 mb-0 ${
                status === "success"
                  ? "text-success"
                  : status === "error"
                  ? "text-danger"
                  : ""
              }`}
            >
              {message}
            </p>
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
