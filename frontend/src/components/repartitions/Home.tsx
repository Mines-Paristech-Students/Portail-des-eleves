import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import { authService } from "../../App";
import { PageTitle } from "../utils/PageTitle";
import { RepSidebar } from "./RepSidebar";

export const RepartitionsHome = ({
  sidebarActions,
}: {
  sidebarActions?: any;
}) => (
  <Container className="mt-4">
    <Row>
      <Col md="3">
        <RepSidebar isStaff={authService.isStaff} actions={sidebarActions} />
      </Col>
      <Col md="9"> 
    <PageTitle>{"Bienvenue dans l'algorithme de répartition !"}</PageTitle>
    </Col>
    </Row>
  </Container>

);