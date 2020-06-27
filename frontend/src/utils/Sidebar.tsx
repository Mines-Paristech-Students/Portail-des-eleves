import React from "react";
import { Link } from "react-router-dom";

export const SidebarItem = ({ icon, to, children }) => (
  <Link
    className="list-group-item list-group-item-action px-0 d-flex align-items-center"
    to={to}
  >
    <span className="icon mr-3">
      <i className={"fe fe-" + icon} />
    </span>
    {children}
  </Link>
);

export const SidebarCategory = ({ title, children }) => (
  <>
    <h2 className="page-title mb-1 mt-5">{title}</h2>
    {children}
  </>
);

export const Sidebar = ({ title, children, ...rest }) => (
  <>
    <h1 className="page-title mb-5 mt-5">{title}</h1>
    <div className="list-group list-group-transparent mb-0">{children}</div>
  </>
);
