import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";

export const Homepage = () => {
  return (
    <Container className="mt-5">
      <PageTitle>Homepage</PageTitle>
      {/*<Chat />*/}
      {/*<MultiUserSelector onChange={() => {}} />*/}
    </Container>
  );
};
