import React from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { BirthdayWidget } from "./widgets/BirthdayWidget";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { NewsWidget } from "./widgets/NewsWidget";

export const Homepage = () => {
  return (
    <Container>
      <PageTitle>Homepage</PageTitle>
      {/*<Chat />*/}
      <Row>
        <Col md={4}>
          <BirthdayWidget />
        </Col>
        <Col>
          <NewsWidget/>
        </Col>
      </Row>
    </Container>
  );
};
