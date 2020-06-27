import React from "react";
import { Poll } from "../../../models/polls";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Modal from "react-bootstrap/Modal";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as Yup from "yup";
import { Formik, Form, useFormikContext } from "formik";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import { SelectFormGroup } from "../../utils/forms/SelectFormGroup";
import { DayPickerFormGroup } from "../../utils/forms/DayPickerFormGroup";
import dayjs from "dayjs";

const StateField = () => (
  <SelectFormGroup
    selectType="pills"
    type="radio"
    label="Statut"
    name="state"
    items={[
      {
        value: "ACCEPTED",
        children: (
          <span className="selectgroup-button selectgroup-button-icon">
            <i className="fe fe-check text-success" /> Accepté
          </span>
        ),
      },
      {
        value: "REJECTED",
        children: (
          <span className="selectgroup-button selectgroup-button-icon">
            <i className="fe fe-x text-danger" /> Refusé
          </span>
        ),
      },
      {
        value: "REVIEWING",
        children: (
          <span className="selectgroup-button selectgroup-button-icon">
            <i className="fe fe-eye text-warning" /> En attente
          </span>
        ),
      },
    ]}
  />
);

const AdminCommentField = () => {
  const { values } = useFormikContext<any>();

  if (values.state === "REJECTED") {
    return (
      <TextFormGroup
        label="Commentaire"
        name="adminComment"
        type="text"
        placeholder="Un commentaire ?"
      />
    );
  }

  return null;
};

const DateField = () => {
  const { values } = useFormikContext<any>();

  if (values.state === "ACCEPTED") {
    return (
      <DayPickerFormGroup label="Date de publication" name="publicationDate" />
    );
  }

  return null;
};

export const PollEditModalAdminForm = ({
  poll,
  handleClose,
  onUpdate,
}: {
  poll: Poll;
  handleClose: () => void;
  onUpdate: any;
}) => {
  let minDate = new Date();
  minDate.setDate(minDate.getDate() - 1);

  const onSubmit = (values, { setSubmitting }) => {
    let data = {
      state: values.state,
      adminComment: values.state === "REJECTED" ? values.adminComment : "",
      publicationDate: values.publicationDate,
    };

    onUpdate(data, setSubmitting);
  };

  return (
    <Formik
      initialValues={{
        state: poll.state,
        adminComment: poll.adminComment,
        publicationDate: poll.publicationDate,
      }}
      validationSchema={Yup.object({
        publicationDate: Yup.date().when("state", {
          is: "ACCEPTED",
          then: Yup.date()
            .min(
              minDate,
              "Le sondage doit être publié aujourd’hui ou dans le futur."
            )
            .required("Ce champ est requis."),
          otherwise: Yup.date().notRequired(),
        }),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <Modal.Body>
          <Container>
            <Row>
              <Col>
                <Card className="mx-auto">
                  <Card.Header>
                    <Card.Title as="h3">{poll.question}</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Card.Subtitle>
                      <em>
                        Envoyé par {poll.user} le{" "}
                        {dayjs(poll.creationDateTime).format( "DD/MM/YYYY")}.
                      </em>
                    </Card.Subtitle>

                    <span className="selectgroup-button">
                      {poll.choices[0].text}
                    </span>
                    <span className="selectgroup-button">
                      {poll.choices[1].text}
                    </span>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
                <StateField />
                <AdminCommentField />
                <DateField />
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Button
            className="btn-icon"
            variant="outline-danger"
            onClick={handleClose}
          >
            Annuler
          </Button>
          <Button className="btn-icon" variant="outline-success" type="submit">
            Valider
          </Button>
        </Modal.Footer>
      </Form>
    </Formik>
  );
};
