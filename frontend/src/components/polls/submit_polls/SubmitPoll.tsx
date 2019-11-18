import React from 'react';
import {PollsBase} from "../PollsBase";
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import {getRandom} from "../../../utils/random";
import {Form, Formik} from "formik";
import * as Yup from 'yup';
import {TextFormGroup} from "../../utils/forms/TextFormGroup";

export function SubmitPoll() {
    const [questionPlaceholder, choice0Placeholder, choice1Placeholder] = getRandom([
        ["Le portail…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["La piche…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["Le BDE…", "C’était mieux avant.", "C’est moins bien maintenant."],
        ["Le plus beau ?", "17bocquet", "17cantelobre"],
    ]);

    function SubmitPollForm() {
        return (
            <Card className="text-left">
                <Formik
                    initialValues={{
                        question: "",
                        choice0: "",
                        choice1: "",
                    }}
                    validationSchema={Yup.object({
                        question: Yup.string()
                            .required('Ce champ est requis.'),
                        choice0: Yup.string()
                            .required('Ce champ est requis.'),
                        choice1: Yup.string()
                            .required('Ce champ est requis.'),
                    })}
                    onSubmit={(values, {setSubmitting}) => {
                        // TODO.
                    }}
                >
                    <Form>
                        <Card.Body>
                            <TextFormGroup
                                label="Question"
                                name="question"
                                type="text"
                                placeholder={questionPlaceholder}
                            />
                            <TextFormGroup
                                label="Choix 1"
                                name="choice0"
                                type="text"
                                placeholder={choice0Placeholder}
                            />
                            <TextFormGroup
                                label="Choix 2"
                                name="choice1"
                                type="text"
                                placeholder={choice1Placeholder}
                            />
                        </Card.Body>

                        <Card.Footer className="text-right">
                            <Button type="submit"
                                    variant="outline-success">
                                Envoyer
                            </Button>
                        </Card.Footer>
                    </Form>
                </Formik>
            </Card>
        );
    }

    return (
        <PollsBase title={<h1 className="page-title page-header mb-5">Proposer un sondage</h1>}>
            <Container>
                <Row>
                    <Col xs={{offset: 3, span: 6}}>
                        <SubmitPollForm/>
                    </Col>
                </Row>
            </Container>
        </PollsBase>
    );
}
