import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import React, { useContext } from "react";
import { Sidebar, SidebarItem } from "../utils/sidebar/Sidebar";
import { ForbiddenError } from "../utils/ErrorPage";
import { UserContext } from "../../services/authService";

export const SettingsSidebar = () => (
  <Sidebar title="Paramètres">
    <SidebarItem icon="settings" to={`/parametres`} exact>
      Paramètres globaux
    </SidebarItem>
    <SidebarItem icon="user" to={`/parametres/membres`} exact={false}>
      Membres
    </SidebarItem>
    <SidebarItem icon="zap" to={`/parametres/associations`} exact={false}>
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
}) => {
  const user = useContext(UserContext);

  if (!user?.isStaff) {
    return <ForbiddenError />;
  }

  return (
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
};
