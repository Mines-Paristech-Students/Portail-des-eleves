import React, {useState} from 'react';
import Logo from "./logo-mines.png";
import {Link} from "react-router-dom";

import {
  Collapse,
  Navbar as BoostrapNavbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

// function Navbar() {
//     let dropdownOpen = false ;
//
//     return <div className="header py-4">
//     <div className="container">
//         <div className="d-flex">
//            <Link to="/" className="header-brand">
//                 <img src={Logo} className="header-brand-img" alt="site logo" />
//             </Link>
//             <div className="d-flex order-lg-2 ml-auto">
//                 <div className="dropdown">
//                     <div className="nav-link pr-0 leading-none">
//                         <span className="avatar"/>
//                         <span className="ml-2 d-lg-block">
//                             <span className="text-default">User name</span>
//                             <small className="text-muted d-block mt-1">P17</small>
//                         </span>
//                     </div>
//                     <NavDropdown title="Dropdown" id="basic-nav-dropdown">
//                         <a className="dropdown-item">
//                             <i className="dropdown-icon fe fe-user"/> Profil
//                         </a>
//                         <a className="dropdown-item" href="#">
//                             <i className="dropdown-icon fe fe-settings"/> Paramètres
//                         </a>
//                         <div className="dropdown-item">
//                             <i className="dropdown-icon fe fe-log-out"/> Déconnexion
//                         </div>
//                     </NavDropdown>
//                 </div>
//             </div>
//             <a href="#" className="header-toggler d-lg-none ml-3 ml-lg-0" data-toggle="collapse" data-target="#headerMenuCollapse">
//                 <span className="header-toggler-icon"/>
//             </a>
//         </div>
//     </div>
// </div>;
// }

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
	<BoostrapNavbar color="light" light expand="md">
		<NavbarBrand href="/">reactstrap</NavbarBrand>
		<NavbarToggler onClick={toggle} />
		<Collapse isOpen={isOpen} navbar>
			<Nav className="ml-auto" navbar>
				<NavItem>
					<NavLink href="/components/">Components</NavLink>
				</NavItem>
				<NavItem>
					<NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
				</NavItem>
				<UncontrolledDropdown nav inNavbar>
					<DropdownToggle nav caret>
						Options
					</DropdownToggle>
					<DropdownMenu right>
						<DropdownItem>
							Option 1
						</DropdownItem>
						<DropdownItem>
							Option 2
						</DropdownItem>
						<DropdownItem divider />
						<DropdownItem>
							Reset
						</DropdownItem>
					</DropdownMenu>
				</UncontrolledDropdown>
			</Nav>
		</Collapse>
	</BoostrapNavbar>
  );
}

export default Navbar;
