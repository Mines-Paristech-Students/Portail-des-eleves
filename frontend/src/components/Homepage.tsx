import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { MultiUserSelector } from "./utils/MultiUserSelector";

export const Homepage = () => {
    return (
        <Container>
            <PageTitle>Homepage</PageTitle>
            {/*<Chat />*/}
            <MultiUserSelector onChange={() => {}} />
        </Container>
    );
};
