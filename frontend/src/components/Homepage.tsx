import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { Chat } from "../chat/Chat";
import { Test } from "./Test";

export const Homepage = () => {
    return (
        <Container>
            <PageTitle>Homepage</PageTitle>
            <Test />
            <Chat />
        </Container>
    );
};
