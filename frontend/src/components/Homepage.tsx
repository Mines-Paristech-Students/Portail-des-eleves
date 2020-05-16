import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { Chat } from "../chat/Chat";

export const Homepage = () => {
    return (
        <Container>
            <PageTitle>Homepage</PageTitle>
            <Chat />
        </Container>
    );
};
