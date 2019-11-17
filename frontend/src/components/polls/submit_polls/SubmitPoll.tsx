import React from 'react';
import {PollsBase} from "../PollsBase";
import Form from 'react-bootstrap/Form';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';

export function SubmitPoll() {
    function SubmitPollForm() {
        return (
            <Card className="text-left">
                <Form>
                    <Card.Body>
                        <Form.Group controlId="question">
                            <Form.Label>Question</Form.Label>
                            <Form.Control name="question"
                                          type="text"
                                          placeholder="Le portail…"/>
                        </Form.Group>

                        <Form.Group controlId="choice-0">
                            <Form.Label>Choix 1</Form.Label>
                            <Form.Control name="choice-0"
                                          type="text"
                                          placeholder="C’était mieux avant"/>
                        </Form.Group>

                        <Form.Group controlId="choice-1">
                            <Form.Label>Choix 2</Form.Label>
                            <Form.Control name="choice-1"
                                          type="text"
                                          placeholder="C’est moins bien maintenant"/>
                        </Form.Group>
                    </Card.Body>

                    <Card.Footer className="text-right">
                        <Button type="submit"
                                variant="outline-success">
                            Envoyer
                        </Button>
                    </Card.Footer>
                </Form>
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
