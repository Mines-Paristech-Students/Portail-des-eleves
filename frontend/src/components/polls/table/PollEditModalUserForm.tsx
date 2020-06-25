import React from "react";
import { Poll } from "../../../models/polls";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Form, Formik } from "formik";
import { TextFormGroup } from "../../utils/forms/TextFormGroup";
import * as Yup from "yup";

export const PollEditModalUserForm = ({
  poll,
  handleClose,
  onUpdate,
}: {
  poll: Poll;
  handleClose: () => void;
  onUpdate: any;
}) => {
  const onSubmit = (values, { setSubmitting }) => {
    let data = {
      question: values.question,
      choices: [
        {
          text: values.choice0,
        },
        {
          text: values.choice1,
        },
      ],
    };

    onUpdate(data, setSubmitting);
  };

  return (
    <Formik
      initialValues={{
        question: poll.question,
        choice0: poll.choices[0].text,
        choice1: poll.choices[1].text,
      }}
      validationSchema={Yup.object({
        question: Yup.string().required("Ce champ est requis."),
        choice0: Yup.string().required("Ce champ est requis."),
        choice1: Yup.string().required("Ce champ est requis."),
      })}
      onSubmit={onSubmit}
    >
      <Form>
        <Modal.Body>
          <TextFormGroup label="Question" name="question" type="text" />
          <TextFormGroup label="Choix 1" name="choice0" type="text" />
          <TextFormGroup label="Choix 2" name="choice1" type="text" />
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
