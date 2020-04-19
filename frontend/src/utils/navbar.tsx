import React, { useState } from "react";
import { Redirect } from "react-router-dom";

// @ts-ignore
import Logo from "../logo-mines.png";
import { Link } from "react-router-dom";

import {
    NavbarToggler,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { authService } from "../App";

const links = [
    { icon: "home", url: "/", label: "Accueil" },
    { icon: "zap", url: "/associations", label: "Associations" }
    ];

const linksComponent = links.map(({ icon, url, label }) => {
    let className = "";
    if (icon) {
        className = "fe fe-" + icon;
    }

    return (
        <li className="nav-item" key={url}>
            <Link to={url} className="nav-link">
                <i className={className} /> {label}
            </Link>
        </li>
    );
});

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [redirectToLogin, setRedirectToLogin] = useState<boolean>(false);
    const toggle = () => setIsOpen(!isOpen);

    let barClassNames = "header d-lg-flex p-0";
    if (!isOpen) {
        barClassNames += " collapse";
    }

    const logout = () => {
        authService.signOut().then(() => {
            setRedirectToLogin(true);
        });
    };

    if (redirectToLogin) {
        return <Redirect to={"/login"} />;
    }

    return (
        <>
            <div className="header py-4">
                <div className="container">
                    <div className="d-flex">
                        <Link to="/" className="header-brand">
                            <img
                                src={Logo}
                                className="header-brand-img"
                                alt="site logo"
                            />
                        </Link>
                        <div className="d-flex order-lg-2 ml-auto">
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav className="text-left">
                                    <span className="avatar" />
                                    <span className="ml-2 d-lg-block">
                                        <span className="text-default">
                                            Adrien B.
                                        </span>
                                        <small className="text-muted d-block mt-0">
                                            P17
                                        </small>
                                    </span>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem>
                                        <i className="dropdown-icon fe fe-user" />{" "}
                                        Profil
                                    </DropdownItem>
                                    <DropdownItem>
                                        <i className="dropdown-icon fe fe-settings" />{" "}
                                        Paramètres
                                    </DropdownItem>
                                    <DropdownItem divider />
                                    <DropdownItem onClick={logout}>
                                        <i className="dropdown-icon fe fe-log-out" />{" "}
                                        Déconnexion
                                    </DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                        <NavbarToggler
                            className="header-toggler d-lg-none ml-3 ml-lg-0"
                            onClick={toggle}
                        >
                            <span className="header-toggler-icon" />
                        </NavbarToggler>
                    </div>
                </div>
            </div>
            <div className={barClassNames}>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg order-lg-first">
                            <ul className="nav nav-tabs border-0 flex-column flex-lg-row">
                                {linksComponent}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Navbar;
