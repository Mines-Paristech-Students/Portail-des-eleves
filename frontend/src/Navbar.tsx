import React, {useState} from 'react';
import Logo from "./logo-mines.png";
import {Link} from "react-router-dom";

import {
  NavbarToggler,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

function Navbar() {
	const [isOpen, setIsOpen] = useState(true);
	const toggle = () => setIsOpen(!isOpen);

	let barClassNames = "header d-lg-flex p-0";
	if (!isOpen) {
		barClassNames += " collapse";
	}

	return <>
		<div className="header py-4">
			<div className="container">
				<div className="d-flex">
					<Link to="/" className="header-brand">
						<img src={Logo} className="header-brand-img" alt="site logo" />
					</Link>
					<div className="d-flex order-lg-2 ml-auto">
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav className="text-left">
								<span className="avatar"/>
								<span className="ml-2 d-lg-block">
									 <span className="text-default">Adrien B.</span>
									 <small className="text-muted d-block mt-0">P17</small>
								 </span>
							</DropdownToggle>
							<DropdownMenu right>
								<DropdownItem>
									<i className="dropdown-icon fe fe-user"/> Profil
								</DropdownItem>
								<DropdownItem>
									<i className="dropdown-icon fe fe-settings"/> Paramètres
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem>
									<i className="dropdown-icon fe fe-log-out"/> Déconnexion
								</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					</div>
					<NavbarToggler className="header-toggler d-lg-none ml-3 ml-lg-0" onClick={toggle}>
						<span className="header-toggler-icon"/>
					</NavbarToggler>
				</div>
			</div>
		</div>
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
