import React from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

export const PollsLoading = () =>
    <Container>
        <Spinner animation="border" role="status"/>
    </Container>;
