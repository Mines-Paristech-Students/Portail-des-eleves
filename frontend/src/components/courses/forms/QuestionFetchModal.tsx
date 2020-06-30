import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Button,
  Modal,
  Spinner,
  ListGroup,
  Badge,
  Alert,
} from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { api } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Question, QuestionCategory } from "../../../models/courses/question";

const RefreshAlert = () => {
  const [showAlert, setShowAlert] = useState(true);

  if (showAlert)
    return (
      <Alert variant="warning" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>
          <i className="fe fe-alert-triangle" /> Attention !
        </Alert.Heading>
        <p>
          Cette opération rafraichit la page. Toute modification non sauvegardée
          sera perdue.
        </p>
      </Alert>
    );

  return null;
};

export const QuestionFetchModal = ({ formId, trigger }) => {
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [forms, setForms] = useState<FormModel[]>([]);

  const newToast = useContext(ToastContext);

  useEffect(() => {
    setShow(trigger);
  }, [trigger]);

  const formik = useFormik({
    initialValues: { idForm: -1, questions: [] },
    validate: (values) => {
      return values.questions.length === 0 ? { questions: "Empty" } : {};
    },
    onSubmit: (values, { setSubmitting }) => {
      Promise.all(
        values.questions.map((question: Question) => {
          question.id = undefined;
          question.form = formId;

          return api.courses.forms.questions.save(question).catch((err) => {
            newToast.sendErrorToast(
              `Could not insert question ${question.label}`
            );
          });
        })
      ).finally(() => {
        newToast.sendInfoToast("Rafraichissement...");
        setSubmitting(false);
        setShow(false);
        window.location.reload(false);
      });
    },
  });

  useEffect(
    () => {
      api.courses.forms
        .list()
        .then((res) => {
          setForms(res.results);
          setIsLoading(false);
        })
        .catch((err) => {
          newToast.sendErrorToast("Could not fetch questions...");
        });
    },
    // eslint-disable-next-line
    []
  );

  useEffect(
    () => {
      // idForm is positive in django model
      if (formik.values.idForm === -1) return;

      setIsLoading(true);
      api.courses.forms.questions
        .list(formik.values.idForm)
        .then((questions) => {
          formik.setErrors({});
          formik.setFieldValue("questions", questions);
          setIsLoading(false);
        })
        .catch((err) => {
          formik.setErrors({ questions: "Could not fetch" });
          formik.setFieldValue("questions", []);
          setIsLoading(false);
          newToast.sendErrorToast("Could not fetch questions...");
        });
    },
    // eslint-disable-next-line
    [formik.values.idForm]
  );

  if (show)
    return (
      <Modal show={show} onHide={() => setShow(false)}>
        <Form onSubmit={formik.handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Récupération</Modal.Title>
            {(isLoading || formik.isSubmitting) && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Modal.Header>

          <Modal.Body>
            <RefreshAlert />

            <br />

            <Form.Label>Source</Form.Label>
            <Form.Control
              as="select"
              id="idForm"
              name="idForm"
              onChange={formik.handleChange}
              value={formik.values.idForm}
            >
              <option selected value={undefined}>
                {" "}
                -- Formulaire --{" "}
              </option>
              {forms.map((form) => (
                <option value={form.id} id={"option_form" + form.id}>
                  {form.name}
                </option>
              ))}
            </Form.Control>

            <br />

            <ListGroup as="ul" className="overflow-auto">
              <ListGroup.Item active>Détails des questions</ListGroup.Item>
              {formik.values.questions.map((question: Question) => (
                <ListGroup.Item>
                  <Badge variant="info">
                    {question.category === QuestionCategory.Comment ? (
                      <i className="fe fe-star" />
                    ) : (
                      <i className="fe fe-edit" />
                    )}
                  </Badge>
                  {question.label}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Modal.Body>

          <Modal.Footer className="d-flex justify-content-around">
            <Button
              variant="primary"
              type="submit"
              disabled={formik.isSubmitting}
            >
              Ajouter
            </Button>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Fermer
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    );

  return null;
};
