import React from "react";
import { PageTitle } from "../utils/PageTitle";
import Container from "react-bootstrap/Container";
import { Loading } from "../utils/Loading";

export const AssociationHome = ({ association }) => {
    if (!association) {
        return <Loading />;
    }

    return (
        <Container>
            <PageTitle>{association.name}</PageTitle>
            <p>Home page !!!</p>
        </Container>
    );
};
