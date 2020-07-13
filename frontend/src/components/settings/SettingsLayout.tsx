import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React from "react";
import { Sidebar, SidebarItem } from "../utils/sidebar/Sidebar";

export const SettingsSidebar = () => (
  <Sidebar title="Paramètres">
    <SidebarItem icon="settings" to={`/parametres`} exact>
      Paramètres globaux
    </SidebarItem>
    <SidebarItem icon="user" to={`/parametres/membres`} exact>
      Membres
    </SidebarItem>
    <SidebarItem icon="zap" to={`/parametres/associations`} exact>
      Associations
    </SidebarItem>
  </Sidebar>
);

/**
 * @param additionalSidebar a React element, should be any of the component
 * present in src/components/utils/sidebar
 * @param children
 * @constructor
 */
export const SettingsLayout = ({
  additionalSidebar = null,
  children = null,
}: {
  additionalSidebar?: any;
  children?: any;
}) => (
  <Container>
    <Row>
      <Col md={3}>
        <SettingsSidebar />
        {additionalSidebar}
      </Col>
      <Col md={9}>{children}</Col>
    </Row>
  </Container>
);
