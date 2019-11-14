import React from "react";
import { Link } from "react-router-dom";

export const SideBarItem = ({ icon, to, children }) => {
    const iconClassName = "fe fe-" + icon;
    return (
        <Link
            className="list-group-item list-group-item-action px-0 d-flex align-items-center"
            to={to}
        >
            <span className="icon mr-3">
                <i className={iconClassName} />
            </span>
            {children}
        </Link>
    );
};

export const SideBar = ({ title, children, ...rest }) => {
    return (
        <>
            <h1 className="page-title mb-5">{title}</h1>
            <div className="list-group list-group-transparent mb-0">
                {children}
            </div>
        </>
    );
};
