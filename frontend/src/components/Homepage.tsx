import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { BirthdayWidget } from "./widgets/BirthdayWidget";

export const Homepage = () => {
  return (
    <Container>
      <PageTitle>Homepage</PageTitle>
      {/*<Chat />*/}
      <BirthdayWidget />
    </Container>
  );
};
