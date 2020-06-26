import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Modal,
  Container,
  Card,
  Spinner,
  ListGroup,
  Badge,
  Overlay,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import { Formik, useFormik, useField, FormikProps } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Question, QuestionCategory } from "../../../models/courses/question";
import { useParams } from "react-router-dom";
import { CardStatus } from "../../utils/CardStatus";
import { TablerColor } from "../../../utils/colors";
import { EditTooltip, EditTooltipOption } from "./EditTooltip";
import { QuestionFetchModal } from "./QuestionFetchModal";

export const QuestionEditor = ({
  formId,
  question,
  questionIndex,
  showTooltip,
  tooltipOptions,
  deleteQuestion,
}) => {
  const [status, setStatus] = useState<TablerColor>(TablerColor.Blue);
  const [showModal, setShowModal] = useState(false);
  const newToast = useContext(ToastContext);
  const key: string = question.id + question.label;

  const onSubmit = (question, { setSubmitting, setFieldTouched }) => {
    setStatus(TablerColor.Orange);

    api.courses.forms.questions
      .save(question)
      .then((res) => {
        newToast.sendSuccessToast(
          `Updated questions ${res.label} for ${res.form}`
        );

        // Re-initialization
        setSubmitting(false);
        setStatus(TablerColor.Green);
        for (let key in question) {
          setFieldTouched(key, false);
        }

        // Resets to normal after user has a chance to see success
        setTimeout(() => setStatus(TablerColor.Blue), 2000);
      })
      .catch((err) => {
        newToast.sendErrorToast(err.response.status + " " + err.response.data);
        setSubmitting(false);
        setStatus(TablerColor.Red);
      });
  };

  const validate = (question) => {
    if (question.label === "") {
      setStatus(TablerColor.Pink);
      return { label: "Ne peut pas etre vide" };
    }
    return {};
  };

  return (
    <>
      <Formik
        id={"formik" + question.id}
        initialValues={question}
        validate={validate}
        onSubmit={onSubmit}
      >
        {(props: FormikProps<Question>) => {
          let isTouched = false;
          Object.keys(props.touched).forEach((key) => {
            if (props.touched[key]) isTouched = true;
          });
          if (isTouched && status === TablerColor.Blue)
            setStatus(TablerColor.Cyan);

          let questionTooltipOptions: EditTooltipOption[] = [
            {
              icon: "folder-plus",
              onClick: () => setShowModal(!showModal),
              tooltip: "Récupérer",
            },
            {
              icon: "refresh-ccw",
              onClick: () => props.handleReset(),
              tooltip: "Ré-initialiser",
            },
            {
              icon: "trash-2",
              onClick: deleteQuestion,
              tooltip: "Ré-initialiser",
            },
          ];

          return (
            <>
              <Col sm={11} key={"Col1-" + key}>
                <Card as={Form} onSubmit={props.handleSubmit}>
                  <CardStatus color={status} />

                  <Card.Header>
                    <Card as={Form.Group}>
                      <Form.Control
                        placeholder="Intitulé"
                        id="label"
                        name="label"
                        value={props.values.label}
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                      />

                      {props.touched.label && props.errors.label && (
                        <Form.Control.Feedback type="invalid">
                          {props.errors.label}
                        </Form.Control.Feedback>
                      )}

                      <CardStatus
                        position="left"
                        color={
                          props.touched.label
                            ? props.errors.label
                              ? TablerColor.Red
                              : TablerColor.Cyan
                            : TablerColor.Blue
                        }
                      />
                    </Card>
                  </Card.Header>

                  <Card.Body>
                    <MyRadioField
                      label="Catégorie"
                      id={"category" + question.id}
                      name="category"
                      mapping={{
                        Commentaire: "C",
                        Notation: "R",
                      }}
                      disabled={question.id ? false : true}
                      {...props}
                    />

                    <Form.Group>
                      <Form.Label>Paramètres</Form.Label>
                      <Form.Check
                        type="switch"
                        label="Obligatoire"
                        id={"required" + question.id}
                        name="required"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        checked={props.values.required}
                      />
                      <br />
                      <Form.Check
                        type="switch"
                        label="Activer"
                        id={"archived" + question.id}
                        name="archived"
                        onBlur={props.handleBlur}
                        onChange={props.handleChange}
                        checked={props.values.archived}
                      />
                    </Form.Group>
                  </Card.Body>

                  <Card.Footer className="d-flex justify-content-around">
                    <Button type="submit" disabled={props.isSubmitting}>
                      Valider
                      {props.isSubmitting && (
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
                      )}
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
              <Col sm={1} id={"func" + question.id} key={"Col2-" + key}>
                {showTooltip && (
                  <EditTooltip
                    questionIndex={questionIndex}
                    tooltipOptions={[].concat.apply(
                      [],
                      [tooltipOptions, questionTooltipOptions]
                    )}
                  />
                )}
              </Col>
            </>
          );
        }}
      </Formik>
      <QuestionFetchModal formId={formId} trigger={showModal} />
    </>
  );
};

const MyRadioField = ({ label, mapping, disabled, ...props }) => {
  // @ts-ignore
  const [field, meta, helper] = useField(props);

  if (meta.touched && meta.error) return <p>{meta.error}</p>;
  return (
    <Form.Group>
      <Form.Label>{label}</Form.Label>
      {Object.keys(mapping).map((key, value) => (
        <Form.Check
          type="radio"
          key={key + value}
          label={key}
          value={mapping[key]}
          checked={field.value === mapping[key]}
          onChange={() => helper.setValue(mapping[key])}
          disabled
        />
      ))}
    </Form.Group>
  );
};
