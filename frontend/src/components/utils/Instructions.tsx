import Container from "react-bootstrap/Container";
import React from "react";

export const Instructions = ({ title, children, emoji, emojiAriaLabel }) => (
    <Container className={"text-center"}>
        <p style={{ fontSize: "10em" }} className={"m-0"}>
            <span role="img" aria-label={emojiAriaLabel}>
                {emoji}
            </span>
        </p>
        <h1 className={"my-2"}>{title}</h1>
        <p style={{ fontSize: "2em" }}>
            <small className="text-muted">{children}</small>
        </p>
    </Container>
);
