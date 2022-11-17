import React, { useState } from "react";
import { Link } from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { UserAvatar } from "../avatar/UserAvatar";
import { Size } from "../../../utils/size";
import { User } from "../../../models/user";
import { authService } from "../../../App";

export const UserDropdown = ({
  user,
  drop,
  ...props
}: {
  user: User;
  drop?: "up" | "down";
  [key: string]: any;
}) => {
  const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);

  const logout = () => {
    authService.signOut().then(() => {
      setRedirectToLogin(true);
    });
  };

  if (redirectToLogin) {
    window.location.reload();
    return null;
  }

  return (
    <NavDropdown
      className={"ml-auto " + props.className ?? ""}
      id="nav-dropdown"
      bsPrefix="caret-off"
      drop={drop ?? "down"}
      title={
        <Container>
          <Row noGutters={true} className="align-items-center">
            <Col>
              <UserAvatar userId={user.id} link={false} size={Size.Medium} />
            </Col>
            <Col className="pl-0">
              <span className="text-default">
                {user.firstName} {user.lastName}
              </span>
              <small className="text-muted d-block mt-0 text-left">
                {user.promotion}
              </small>
            </Col>
          </Row>
        </Container>
      }
    >
      {/*
                            The `as` prop is used to render a `Link` element instead of an `a` element, which reloads the full page.
                            For some reason, the anonymous function is passed _two_ parameters, and only the first one is the props.
                            */}
      <NavDropdown.Item
        as={(...props) => <Link to={`/profils/${user.id}`} {...props[0]} />}
      >
        <i className="dropdown-icon fe fe-user" /> Mon profil
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>
        <i className="dropdown-icon fe fe-log-out" /> Déconnexion
      </NavDropdown.Item>
    </NavDropdown>
  );
};
