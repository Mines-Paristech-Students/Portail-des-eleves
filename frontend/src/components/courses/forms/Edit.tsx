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

export const EditCourseForm = () => {
    const formId = parseInt(useParams<{ formId: string }>().formId);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [questions, setQuestions] = useState<Question[]>([]);
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

    const addQuestion = () => {
        const newQuestion: Question = {
            label: "",
            required: true,
            archived: false,
            category: QuestionCategory.Rating,
            form: formId,
        };
        let copy = questions.slice();
        copy.push(newQuestion);
        setQuestions(copy);
    };

    const { data: form } = useBetterQuery<FormModel>(
        ["courses.forms.get", formId],
        api.courses.forms.get
    );

    if (isLoading) return <p>Chargement des cours</p>;

    return (
        <Container>
            <PageTitle>Modification de formulaire</PageTitle>

            <Row>{form && <FormEditor form={form} />}</Row>

            <br />

            <Row>
                {questions &&
                    questions.map((question) => (
                        <Col sm={11} id={"Col" + question.id}>
                            <QuestionEditor question={question} />
                        </Col>
                    ))}
            </Row>

            <br />

            <Row className="w-100 d-flex justify-content-around">
                <Button onClick={addQuestion}>Ajouter une question</Button>

                <FetchQuestionsModal formId={formId} />
            </Row>
        </Container>
    );
};

const FormEditor = ({ form }) => {
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        initialValues: { name: form.name },
        validate: (values) =>
            values.name === "" ? { errors: "Cannot be empty" } : {},
        onSubmit: (values, { setSubmitting }) => {
            form.name = values.name;
            api.courses.forms
                .save(form)
                .then((res) => {
                    newToast.sendSuccessToast(`Updated ${form.name}`);
                    setSubmitting(false);
                })
                .catch((err) => {
                    newToast.sendErrorToast("Could not update form...");
                    setSubmitting(false);
                });
        },
    });

    return (
        <Form onSubmit={formik.handleSubmit}>
            <Row>
                <Col>
                    <Form.Label>Nom: </Form.Label>
                </Col>
                <Col>
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
                <Col>
                    <Button type="submit" disabled={formik.isSubmitting}>
                        Modifier
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

const FetchQuestionsModal = ({ formId }) => {
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [forms, setForms] = useState<FormModel[]>([]);
    const newToast = useContext(ToastContext);

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
                    console.log(question.id);
                    return api.courses.forms.questions
                        .save(question)
                        .then((question) => {
                            newToast.sendSuccessToast(
                                `Could not insert question ${question.label}`
                            );
                        })
                        .catch((err) => {
                            newToast.sendErrorToast(
                                `Could not insert question ${question.label}`
                            );
                        });
                })
            ).then((data) => {
                setSubmitting(false);
                setIsFetching(false);
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

    return (
        <>
            <Button onClick={(e) => setIsFetching(true)} disabled={isFetching}>
                Récupérer d'un autre formulaire
            </Button>

            {isFetching && (
                <Modal show={isFetching} onHide={() => setIsFetching(false)}>
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
                                    <option
                                        value={form.id}
                                        id={"option_form" + form.id}
                                    >
                                        {form.name}
                                    </option>
                                ))}
                            </Form.Control>

                            <br />

                            <ListGroup as="ul" className="overflow-auto">
                                <ListGroup.Item active>
                                    Détails des questions
                                </ListGroup.Item>
                                {formik.values.questions.map(
                                    (question: Question) => (
                                        <ListGroup.Item>
                                            <Badge variant="info">
                                                {question.category ==
                                                QuestionCategory.Comment ? (
                                                    <i className="fe fe-star" />
                                                ) : (
                                                    <i className="fe fe-edit" />
                                                )}
                                            </Badge>
                                            {question.label}
                                        </ListGroup.Item>
                                    )
                                )}
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
                            <Button
                                variant="secondary"
                                onClick={() => setIsFetching(false)}
                            >
                                Fermer
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
            )}
        </>
    );
};

export const QuestionEditor = ({ question }) => {
    const [status, setStatus] = useState<TablerColor>(TablerColor.Blue);
    const [popover, setPopover] = useState<boolean>(false);
    const newToast = useContext(ToastContext);

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
                newToast.sendErrorToast(
                    err.response.status + " " + err.response.data
                );
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

                return (
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
                            {/* <Button
                                onClick={() => {
                                    console.log("reset");
                                    for (let key in question) {
                                        props.setFieldTouched(key, false);
                                    }
                                    setStatus(TablerColor.Blue);
                                    props.handleReset();
                                }}
                            >
                                Ré-initialiser
                            </Button> */}
                        </Card.Footer>
                    </Card>
                );
            }}
        </Formik>
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
                    id={key + value}
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
