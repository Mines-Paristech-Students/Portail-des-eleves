import React, {useState} from 'react';
import Logo from "./logo-mines.png";
import {Link} from "react-router-dom";
import BootstrapNavbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";

function Navbar() {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const toggle = () => setIsOpen(!isOpen);

    let barClassNames = "header d-lg-flex p-0";
    if (!isOpen) {
        barClassNames += " collapse";
    }

    return <>
        <Container className="header py-4">
            <BootstrapNavbar expand="lg">
                <BootstrapNavbar.Brand>
                    <Link to="/" className="header-brand">
                        <img src={Logo} className="header-brand-img" alt="Logo MINES ParisTech"/>
                    </Link>
                </BootstrapNavbar.Brand>

                <BootstrapNavbar.Toggle aria-controls="navbar"
                                        className="header-toggler d-lg-none ml-3 ml-lg-0"
                                        onClick={toggle}>
                    <span className="header-toggler-icon"/>
                </BootstrapNavbar.Toggle>

                <NavDropdown className="ml-auto"
                             id={"nav-dropdown"}
                             title={
                                 <div>
                                     <div className="avatar"/>
                                     <div className="ml-2">
                                         <span className="text-default">Adrien B.</span>
                                         <small className="text-muted d-block mt-0">P17</small>
                                     </div>
                                 </div>
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
        <div className={barClassNames}>
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-lg order-lg-first">
                        <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                            <li className="nav-item">
                                <Link to="/" className="nav-link"><i className="fe fe-home"/>Accueil</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>;
}

export default Navbar;
