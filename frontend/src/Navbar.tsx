import React, {useState} from 'react';
import Logo from "./logo-mines.png";
import {Link} from "react-router-dom";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

import './navbar.css';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

function Navbar() {
    return <>
        <div className="header">
            <Container>
                <BootstrapNavbar expand="lg">
                    <BootstrapNavbar.Brand>
                        <Link to="/" className="header-brand">
                            <img src={Logo} className="header-brand-img" alt="Logo MINES ParisTech"/>
                        </Link>
                    </BootstrapNavbar.Brand>

                    <NavDropdown className="ml-auto"
                                 id="nav-dropdown"
                                 bsPrefix="caret-off"
                                 title={
                                     <Container>
                                         <Row noGutters={true} className="align-items-center">
                                             <Col>
                                                 <span className="avatar"/>
                                             </Col>
                                             <Col className="ml-2 float-right">
                                                 <span className="text-default">Adrien B.</span>
                                                 <small
                                                     className="text-muted d-block mt-0 text-left">P17</small>
                                             </Col>
                                         </Row>
                                     </Container>
                                 }>
                        <NavDropdown.Item>
                            <i className="dropdown-icon fe fe-user"/> Profil
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                            <i className="dropdown-icon fe fe-settings"/> Paramètres
                        </NavDropdown.Item>
                        <NavDropdown.Divider/>
                        <NavDropdown.Item>
                            <i className="dropdown-icon fe fe-log-out"/> Déconnexion
                        </NavDropdown.Item>
                    </NavDropdown>
                </BootstrapNavbar>
            </Container>
        </div>
        <div className="header">
            <Container>
                <Row className="align-items-center">
                    <Col>
                        <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                            <li className="nav-item">
                                <Link to="/" className="nav-link"><i className="fe fe-home"/>Accueil</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/sondages/" className="nav-link"><i
                                    className="fe fe-check-square"/>Sondages</Link>
                            </li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
    </>
}

export default Navbar;
