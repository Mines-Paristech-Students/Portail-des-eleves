import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { CardBody, Row, Col, Button } from "reactstrap";
import { useFormik } from 'formik';
import { Message } from "./Message"

export const Chat = ({ }) => {
    const validate = values => {
        let error = {};
        return error;
    };

    const formik = useFormik({
        initialValues: {
            message: '',
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const inputStyle = {
        input: {
            width: "100%",
            border: 0,
            outline: 0,
        },
        historyStyle: {
            height: "50%",
            overflow: 'scroll',
        }
    }

    return (
        <Accordion>
            <Card className="mb-0 mr-3 ml-auto w-50 position-fixed fixed-bottom">
                <Card.Header className="bg-primary text-white p-0">
                    <div className="d-flex flex-row justify-content-between w-100">
                    <div className="m-auto">
                        {"General chat"}
                    </div>
                    <div style={{width: "50px"}}>
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">
                        <i className="fe fe-x"/>
                    </Accordion.Toggle>
                    </div>
                    </div>
                </Card.Header>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <Card.Body style={{ height: "200px", padding: 0 }}>
                        <div className="overflow-auto h-100">
                            <Message me={true} sender={"plop"} content={"plop"}/>
                            <Message me={false} sender={"plop"} content={"plop"}/>
                        </div>
                        </Card.Body>
                        <Card.Footer>
                            <Row className="border rounded-pill w-100">
                                <form onSubmit={formik.handleSubmit}>
                                    <Col xs={8}>
                                        <input
                                            className="no-border"
                                            style={inputStyle.input}
                                            id="message"
                                            name="message"
                                            type="text"
                                            onChange={formik.handleChange}
                                            value={formik.values.message}
                                        />
                                        {/* Here tou could add emoji */}
                                    </Col>
                                    <Col xs={4}>
                                        <Button
                                            className="fe fe-arrow-right btn-default active"
                                            style={{ backgroundColor: "white", border: 0, outline: 0 }}
                                        />
                                    </Col>
                                </form>
                            </Row>
                        </Card.Footer>
                    </div>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    )
};