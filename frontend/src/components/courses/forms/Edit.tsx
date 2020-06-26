import React, { useEffect, useContext, useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  Card,
} from "react-bootstrap";
import { Form as FormModel } from "../../../models/courses/form";
import { PageTitle } from "../../utils/PageTitle";
import { api, useBetterQuery } from "../../../services/apiService";
import { useFormik } from "formik";
import { ToastContext } from "../../utils/Toast";
import { Question, QuestionCategory } from "../../../models/courses/question";
import { useParams } from "react-router-dom";
import { CardStatus } from "../../utils/CardStatus";
import { TablerColor } from "../../../utils/colors";
import { QuestionEditor } from "./QuestionEditor";
import { EditTooltipOption } from "./EditTooltip";

export const EditCourseForm = () => {
  const formId = parseInt(useParams<{ formId: string }>().formId);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tooltipIndex, setTooltipIndex] = useState<boolean | number>(false);
  const newToast = useContext(ToastContext);

  /* 
    We don't want the questions to reload, as it could change our components!
    This causes an issue because the components are loaded from a list, which we don't want to change
    */
  useEffect(
    () => {
      api.courses.forms.questions
        .list(formId)
        .then((questions) => {
          setQuestions(questions);
          setIsLoading(false);
        })
        .catch((err) => {
          newToast.sendErrorToast("Could not fetch questions...");
        });
    },
    // eslint-disable-next-line
    []
  );

  const { data: form } = useBetterQuery<FormModel>(
    ["courses.forms.get", formId],
    api.courses.forms.get
  );

  const insertQuestion = (index = questions.length, duplicate = false) => {
    let newQuestion: Question = {
      label: "",
      required: true,
      archived: false,
      category: QuestionCategory.Rating,
      form: formId,
    };
    if (duplicate) {
      newQuestion = Object.assign({}, questions[index]);
    }
    const copy = questions.slice();
    copy.splice(index, 0, newQuestion);
    setQuestions(copy);
  };

  const deleteQuestion = (index: number) => {
    const copy = questions.slice();
    copy.splice(index, 1);
    setQuestions(copy);
    setTooltipIndex(false);
  };

  const updateQuestion = (index: number, question: Question) => {
    const copy = questions.slice();
    copy.splice(index, 1, question);
    setQuestions(copy);
  };

  const tooltipOptions: EditTooltipOption[] = [
    {
      icon: "plus",
      onClick: (index) => insertQuestion(index, false),
      tooltip: "ajouter",
    },
    {
      icon: "copy",
      onClick: (index) => insertQuestion(index, true),
      tooltip: "copier",
    },
  ];

  if (isLoading) return <p>Chargement des cours</p>;

  return (
    <Container>
      <PageTitle>Modification de formulaire</PageTitle>

      <Row>
        <Col sm={11}>{form && <FormEditor form={form} />}</Col>
      </Row>

      <br />

      {questions &&
        questions.map((question, index) => {
          const key: string = question.id + question.label;

          return (
            <Row key={"Row-" + key} onClick={() => setTooltipIndex(index)}>
              <QuestionEditor
                formId={formId}
                question={question}
                questionIndex={index}
                showTooltip={tooltipIndex === index}
                tooltipOptions={tooltipOptions}
                deleteQuestion={() => deleteQuestion(index)}
                updateQuestion={updateQuestion}
              />
            </Row>
          );
        })}
    </Container>
  );
};

const FormEditor = ({ form }) => {
  const newToast = useContext(ToastContext);

  const formik = useFormik({
    initialValues: { name: form.name },
    validate: (values) =>
      values.name === "" ? { errors: "Cannot be empty" } : {},
    onSubmit: (values, { setSubmitting, setFieldTouched }) => {
      form.name = values.name;
      api.courses.forms
        .save(form)
        .then((res) => {
          newToast.sendSuccessToast(`Updated ${form.name}`);
          setSubmitting(false);
          setFieldTouched("name", false);
        })
        .catch((err) => {
          newToast.sendErrorToast("Could not update form...");
          setSubmitting(false);
        });
    },
  });

  return (
    <Card as={Form} onSubmit={formik.handleSubmit} className="p-2">
      <Row>
        <Col sm={10}>
          <Form.Control
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={!!formik.errors.name}
          ></Form.Control>
          {formik.errors.name && (
            <Form.Control.Feedback type="invalid">
              {formik.errors.name}
            </Form.Control.Feedback>
          )}
        </Col>
        <Col sm={2}>
          <Button type="submit" disabled={formik.isSubmitting}>
            <i className="fe fe-check"/>
          </Button>
        </Col>
      </Row>
      <CardStatus
        color={
          formik.touched.name
            ? formik.errors.name
              ? TablerColor.Red
              : TablerColor.Orange
            : TablerColor.Blue
        }
      />
    </Card>
  );
};
