import { Election } from "../../../../models/associations/election";
import { Card, Col, Row, Button } from "react-bootstrap";
import React, { useContext } from "react";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../../utils/forms/TextFormGroup";
import * as Yup from "yup";
import { DayTimePickerInputFormGroup } from "../../../utils/forms/DayTimePickerInputFormGroup";
import { queryCache, useMutation } from "react-query";
import { api } from "../../../../services/apiService";
import { ToastContext } from "../../../utils/Toast";

export const Administration = ({
  election,
  onChange = () => {},
}: {
  election: Election;
  onChange?: (election: Election) => void;
}) => {
  const { sendInfoToast, sendSuccessToast, sendErrorToast } =
    useContext(ToastContext);

  const [save] = useMutation(
    election.id ? api.elections.update : api.elections.create,
    {
      onMutate: () => sendInfoToast("Sauvegarde..."),
      onSuccess: (election) => {
        sendSuccessToast("Sauvegardée !");
        queryCache.invalidateQueries(["election.get"]);
        onChange(election);
      },
      onError: (err) =>
        sendErrorToast(`Erreur lors de la sauvegarde: ${err.toString()}`),
    }
  );

  return (
    <Formik
      initialValues={election}
      onSubmit={(values, action) => save({ ...values, id: election.id })}
      validationSchema={electionSchema}
    >
      <Form>
        <Card>
          <Card.Header>
            <Card.Title>Paramètres</Card.Title>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <TextFormGroup
                  name={"name"}
                  label={"Intitulé de l'élection"}
                  placeholder={"Nouvelle élection"}
                />
              </Col>
              <Col md={6}>
                <TextFormGroup
                  name={"maxChoicesPerBallot"}
                  label={"Nombre de choix maximum par votant"}
                  type={"number"}
                  className={"text-right"}
                  placeholder={"1"}
                />
              </Col>
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
              <i className="fe fe-save" /> Enregistrer
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
  maxChoicesPerBallot: Yup.number()
    .integer("Doit être un nombre entier")
    .required()
    .min(1, "Un choix par ballot au minimum"),
});
