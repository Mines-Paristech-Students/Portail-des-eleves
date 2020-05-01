import React from "react";
import { PageTitle } from "../utils/PageTitle";
import Container from "react-bootstrap/Container";

export const AssociationHome = ({ association }) => {
    if (!association) {
        return "Homepage is loading...";
    }

    return (
        <Container>
            <PageTitle>{association.name}</PageTitle>
            <p>Home page !!!</p>
        </Container>
    );
};
