import React from 'react';
import Logo from "./logo-mines.png";
import {Link} from "react-router-dom";
import NavDropdown from "react-bootstrap/NavDropdown";

function Navbar() {
    let dropdownOpen = false ;

    return <div className="header py-4">
    <div className="container">
        <div className="d-flex">
           <Link to="/" className="header-brand">
                <img src={Logo} className="header-brand-img" alt="site logo" />
            </Link>
            <div className="d-flex order-lg-2 ml-auto">
                <div className="dropdown">
                    <div className="nav-link pr-0 leading-none">
                        <span className="avatar"/>
                        <span className="ml-2 d-lg-block">
                            <span className="text-default">User name</span>
                            <small className="text-muted d-block mt-1">P17</small>
                        </span>
                    </div>
                    <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                        <a className="dropdown-item">
                            <i className="dropdown-icon fe fe-user"/> Profil
                        </a>
                        <a className="dropdown-item" href="#">
                            <i className="dropdown-icon fe fe-settings"/> Paramètres
                        </a>
                        <div className="dropdown-item">
                            <i className="dropdown-icon fe fe-log-out"/> Déconnexion
                        </div>
                    </NavDropdown>
                </div>
            </div>
            <a href="#" className="header-toggler d-lg-none ml-3 ml-lg-0" data-toggle="collapse" data-target="#headerMenuCollapse">
                <span className="header-toggler-icon"/>
            </a>
        </div>
    </div>
</div>;
}

export default Navbar;