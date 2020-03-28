import React, { useContext } from "react";
import Card from "react-bootstrap/Card";
import { CardBody, Row, Col, Button } from "reactstrap";
import { useFormik } from 'formik';

export const Chat = ({ }) => {
    const formik = useFormik({
        initialValues: {
            message: '',
        },
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const inputStyle = {
        div: {
            border: "solid",
            borderRadius: "20px",
        },
        input: {
            width: "100%",
            border: 0,
            outline: 0,
        }
    }

    return (
        <Card className="mb-0 mr-3 ml-auto w-50 position-fixed fixed-bottom">
            <Card.Header className="bg-primary text-white">
                {"General chat"}
            </Card.Header>
            <Card.Body>
                {"Je suis une licore"}
            </Card.Body>
            <Card.Footer>
                <Row style={inputStyle.div} >
                    <form onSubmit={formik.handleSubmit}>
                        <Col>
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
                        <Col>
                            <Button
                                className="fe fe-arrow-right btn-default active "
                                style={{backgroundColor: "white", border:0, outline:0}}
                            />
                        </Col>
                    </form>
                </Row>
            </Card.Footer>
        </Card>
    )
};