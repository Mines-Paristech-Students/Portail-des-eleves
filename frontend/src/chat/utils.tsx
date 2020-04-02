import React, { useState } from "react";
import { useAccordionToggle } from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import { Button, Row, Col } from "reactstrap";

export function ChatToggle({ children, eventKey }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const decoratedOnClick = useAccordionToggle(eventKey, () =>
        setIsOpen(!isOpen)
    );

    return (
        <Card.Header className="bg-primary text-white p-0 h-100">
            <div className="d-flex flex-row justify-content-between w-100">
                <div className="m-auto">
                    {children}
                </div>
                <div style={{ width: "50px", height: "50px" }}>
                    <Button
                        type="button"
                        onClick={decoratedOnClick}
                        className={"btn btn-default fe " + (isOpen ? "fe-chevron-down" : "fe-chevron-up")}
                    />
                </div>
            </div>
        </Card.Header>
    )
}

export function ChatFooter({ formik }) {
    return (
        <Card.Footer>
            <Row className="border rounded-pill w-100">
                <form onSubmit={formik.handleSubmit}>
                    <Col xs={8}>
                        <input
                            className="no-border w-100 b-0"
                            style={{ outline: 0 }}
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
    )
};