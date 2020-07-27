import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { RegistrationList } from "./associations/elections/view/RegistrationList";

export const Homepage = () => {
  return (
    <Container>
      <PageTitle>Homepage</PageTitle>
      {/*<Chat />*/}
      <RegistrationList election={{ id: 4 }} />
    </Container>
  );
};
