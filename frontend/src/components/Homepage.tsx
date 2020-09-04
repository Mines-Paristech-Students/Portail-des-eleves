import React, { useContext } from "react";
import { PageTitle } from "./utils/PageTitle";
import Container from "react-bootstrap/Container";
import { BirthdayWidget } from "./widgets/BirthdayWidget";
import { Col } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { TimelineWidget } from "./widgets/TimelineWidget";
import { UserContext } from "../services/authService";
import { getRandom } from "../utils/random";

const greetings = [
  "Bonjour",
  "Bonsoir",
  "Bonjoir",
  "Salut",
  "Salutations",
  "Hola",
  "Hello",
  "Piche à toi",
  "Schöne Grüße",
  "Xin chào",
];

export const Homepage = () => {
  const user = useContext(UserContext);

  return (
    <Container>
      <PageTitle>
        {getRandom(greetings)}{" "}{user?.firstName}
      </PageTitle>
      {/*<Chat />*/}
      <Row>
        <Col md={4}>
          <BirthdayWidget />
        </Col>
        <Col>
          <TimelineWidget />
        </Col>
      </Row>
    </Container>
  );
};
