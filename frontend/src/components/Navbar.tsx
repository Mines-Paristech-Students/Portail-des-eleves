import React, { useContext } from "react";
import BootstrapNavbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";

import "./navbar.css";
import { UserContext } from "../services/authService";
import { UserDropdown } from "./utils/navbar/UserDropdown";
import { LogoLink } from "./utils/navbar/LogoLink";
import { Menu } from "./utils/navbar/Menu";

/**
 * The links displayed in the navbar. It's an array of objects having three
 * properties each:
 * @param icon the Bootstrap icon to display besides the navbar item. It's the
 *   part after `fe-` in the class name of the icon.
 * @param url the URL of the link.
 * @param label the text to display.
 */
const links = [
  { icon: "home", url: "/", label: "Accueil" },
  { icon: "user", url: "/trombi", label: "Trombi" },
  { icon: "zap", url: "/associations", label: "Associations" },
  { icon: "check-square", url: "/sondages", label: "Sondages" },
  { icon: "book-open", url: "/cours", label: "Cours" },
];

function Navbar() {
  const user = useContext(UserContext);

  return user ? (
    <>
      <div className="header p-1">
        <Container>
          <BootstrapNavbar expand="lg">
            <BootstrapNavbar.Brand>
              <LogoLink />
            </BootstrapNavbar.Brand>
            <BootstrapNavbar.Toggle aria-controls="offcanvasNavbar-expand-lg" />
            <BootstrapNavbar.Offcanvas
              id="offcanvasNavbar-expand-lg"
              aria-labelledby="offcanvasNavbarLabel-expand-lg"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id="offcanvasNavbarLabel-expand-lg">
                  <LogoLink />
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Menu
                  links={links}
                  isStaff={user.isStaff}
                  className="d-lg-none"
                />
                <UserDropdown user={user} />
              </Offcanvas.Body>
            </BootstrapNavbar.Offcanvas>
          </BootstrapNavbar>
        </Container>
      </div>

      <div className="header p-0 d-none d-lg-flex">
        <Container>
          <Menu links={links} isStaff={user.isStaff} />
        </Container>
      </div>
    </>
  ) : null;
}

export default Navbar;
