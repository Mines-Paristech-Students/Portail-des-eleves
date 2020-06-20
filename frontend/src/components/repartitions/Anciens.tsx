import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { authService } from "../../App";
import { RepSidebar } from "./RepSidebar";
import { PageTitle } from "../utils/PageTitle";

export const Anciens =({
  sidebarActions,
}: {
  sidebarActions?: any;
}) => (
  <Container className="mt-4">
    <Row>
      <Col md="3">
        <RepSidebar isStaff={authService.isStaff} actions={sidebarActions} />
      </Col>
    </Row>
  </Container>

);
