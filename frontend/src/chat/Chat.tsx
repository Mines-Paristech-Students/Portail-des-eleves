import React, { useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import { Row, Col, Button } from "reactstrap";
import { useFormik } from 'formik';
import { Message, MessageData } from "./Message";
import { socket } from "./Socket";
import { ToastContext, ToastLevel } from "../utils/Toast";
import { ChatToggle } from "./utils";

export const Chat = ({}) => {
    const [messages, setMessages] = useState<Array<MessageData>>([]);

    const newToast = useContext(ToastContext);

    socket.on('broadcast', function(data: MessageData) {
        newToast({
                message: data.message,
                level: ToastLevel.Error
            });
        setMessages(
            [...messages, data]
        )
    });

    const username: string = '15plop';

    const validate = (values) => {
        if (values.message == "") {
            newToast({
                message: "Message vide",
                level: ToastLevel.Error
            });
            return {message: "Message cannot be empty"};
        }
        return {};
    };

    const formik = useFormik({
        initialValues: {
            message: '',
        },
        validate,
        onSubmit: (values) => {
            socket.emit('message', {message: values.message});
            values.message = "";
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
                <ChatToggle eventKey="0">
                    <p>Message chat</p>
                </ChatToggle>
                <Accordion.Collapse eventKey="0">
                    <div>
                        <Card.Body style={{ height: "200px", padding: 0 }}>
                        <div className="overflow-auto h-100">
                            {
                                messages.map(function(message: MessageData){
                                    return Message(
                                        username == message.username,
                                        message,
                                    )
                                })
                            }
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