import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Sidebar, SidebarItem } from "../utils/sidebar/Sidebar";

export const DirectorySidebar = () => (
  <Sidebar title="Annuaire">
    <SidebarItem icon="message-circle" to={`/annuaire/medecins`} exact={false}>
      Médecins
    </SidebarItem>
  </Sidebar>
);

/**
 * @param additionalSidebar a React element, should be any of the component
 * present in src/components/utils/sidebar
 * @param children
 * @constructor
 */
export const DirectoryLayout = ({
  additionalSidebar = null,
  children = null,
}: {
  additionalSidebar?: any;
  children?: any;
}) => (
  <Container>
    <Row>
      <Col md={3}>
        <DirectorySidebar />
        {additionalSidebar}
      </Col>
      <Col md={9}>{children}</Col>
    </Row>
  </Container>
);
