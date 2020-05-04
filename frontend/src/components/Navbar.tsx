import React, { useContext, useState } from "react";
import Logo from "../logo-mines.png";
import { Link, Redirect } from "react-router-dom";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

import "./navbar.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { authService } from "../App";
import { UserContext } from "../services/authService";
import { formatShortYear } from "../utils/format";

/**
 * The links displayed in the navbar. It's an array of objects having three
 * properties each:
 *   * `icon`: the Bootstrap icon to display besides the navbar item. It's the
 *   part after `fe-` in the class name of the icon.
 *   * `url`: the URL of the link.
 *   * `label`: the text to display.
 */
const links = [
    { icon: "home", url: "/", label: "Accueil" },
    { icon: "zap", url: "/associations", label: "Associations" },
    { icon: "check-square", url: "/sondages", label: "Sondages" }
];

const linksComponent = links.map(({ icon, url, label }) => {
    let className = "";
    if (icon) {
        className = "fe fe-" + icon;
    }

    return (
        <li className="nav-item" key={url}>
            <Link to={url} className="nav-link">
                <i className={className} />
                {label}
            </Link>
        </li>
    );
});

function Navbar() {
    const user = useContext(UserContext);
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);

    const logout = () => {
        authService.signOut().then(() => {
            setRedirectToLogin(true);
        });
    };

    if (redirectToLogin) {
        return <Redirect to={"/login"} />;
    }

    console.log(user);

    return user ? (
        <>
            <div className="header p-1">
                <Container>
                    <BootstrapNavbar expand="lg">
                        <BootstrapNavbar.Brand>
                            <Link to="/" className="header-brand">
                                <img
                                    src={Logo}
                                    className="header-brand-img"
                                    alt="Logo MINES ParisTech"
                                />
                            </Link>
                        </BootstrapNavbar.Brand>

                        <NavDropdown
                            className="ml-auto"
                            id="nav-dropdown"
                            bsPrefix="caret-off"
                            title={
                                <Container>
                                    <Row
                                        noGutters={true}
                                        className="align-items-center"
                                    >
                                        <Col>
                                            <span className="avatar" />
                                        </Col>
                                        <Col className="ml-2 float-right">
                                            <span className="text-default">
                                                {user.firstName} {user.lastName}
                                            </span>
                                            <small className="text-muted d-block mt-0 text-left">
                                                {user.yearOfEntry &&
                                                    `P${formatShortYear(
                                                        user.yearOfEntry
                                                    )}`}
                                            </small>
                                        </Col>
                                    </Row>
                                </Container>
                            }
                        >
                            <NavDropdown.Item>
                                <i className="dropdown-icon fe fe-user" />{" "}
                                Profil
                            </NavDropdown.Item>
                            <NavDropdown.Item>
                                <i className="dropdown-icon fe fe-settings" />{" "}
                                Paramètres
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item onClick={logout}>
                                <i className="dropdown-icon fe fe-log-out" />{" "}
                                Déconnexion
                            </NavDropdown.Item>
                        </NavDropdown>
                    </BootstrapNavbar>
                </Container>
            </div>
            <div className="header p-0">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                                {linksComponent}
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    ) : null;
}

export default Navbar;
