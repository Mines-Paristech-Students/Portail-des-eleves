import React from "react";
import { NavLink } from "react-router-dom";
import BootstrapNav from "react-bootstrap/Nav";

export const Menu = ({
  links,
  isStaff,
  ...props
}: {
  links: MenuLink[];
  isStaff: boolean;
  [key: string]: any;
}) => (
  <BootstrapNav
    className={
      "nav nav-tabs border-0 flex-column flex-lg-row " + props.className ?? ""
    }
  >
    {links.map(({ icon, url, label }) => (
      <li className={`nav-item`} key={url}>
        <NavLink
          exact={url === "/"}
          to={url}
          className={"nav-link px-0"}
          activeClassName={"active"}
        >
          <i className={icon && "fe fe-" + icon} />
          {label}
        </NavLink>
      </li>
    ))}
    {isStaff && (
      <li className="nav-item">
        <NavLink
          exact={false}
          to="/parametres"
          className="nav-link px-0"
          activeClassName="active"
        >
          {" "}
          <i className="fe fe-settings" />
          Paramètres
        </NavLink>
      </li>
    )}
  </BootstrapNav>
);

export type MenuLink = {
  icon: string;
  url: string;
  label: string;
};
