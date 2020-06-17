import Container from "react-bootstrap/Container";
import React from "react";

/**
 * A page-component used to give instructions to the user the first time they
 * arrive on a page. Example : how to upload files or to create a product
 * @param title the main information of the page
 * @param children additional information that will be displayed under the title
 * @param emoji an emoji related to the page content
 * @param emojiAriaLabel a description of the emoji
 * @constructor
 */
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
