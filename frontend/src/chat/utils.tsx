import React, { useState } from "react";
import { useAccordionToggle } from 'react-bootstrap';
import Card from "react-bootstrap/Card";
import { Button } from "reactstrap";

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