import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { RepartitionsSidebar } from "./RepartitionsSidebar";

export const OldRepartitions = ({
  sidebarActions,
}: {
  sidebarActions?: any;
}) => (
  <Container className="mt-4">
    <Row>
      <Col md="3">
        <RepartitionsSidebar actions={sidebarActions} />
      </Col>
    </Row>
  </Container>
);
