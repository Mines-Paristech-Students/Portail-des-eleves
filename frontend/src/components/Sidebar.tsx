import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PageTitle } from "./utils/PageTitle";

/**
 * A link displayed in the sidebar. It has three props:
 *   * `icon`: the Bootstrap icon to display besides the sidebar item. It's the
 *   part after `fe-` in the class name of the icon.
 *   * `to`: the URL of the link.
 *   * `children`: the children to render for the link.
 */
export const SidebarItem = ({ icon, to, children, exact = true }) => {
    const location = useLocation();
    const iconClassName = "fe fe-" + icon;

    return (
        <Link
            className={`list-group-item list-group-item-action d-flex align-items-center ${
                (exact && location.pathname === to) ||
                (!exact && location.pathname.startsWith(to))
                    ? "active"
                    : ""
            }`}
            to={to}
        >
            <span className="icon mr-3">
                <i className={iconClassName} />
            </span>
            {children}
        </Link>
    );
};

export const SidebarSeparator = (props: { size?: number }) => {
    let size = props.size ? props.size : 2;

    return <div className={`pb-${size} pt-${size}`} />;
};

export const Sidebar = ({ title, children, ...rest }) => {
    return (
        <>
            <PageTitle>{title}</PageTitle>
            <div className="list-group list-group-transparent mb-0">
                {children}
            </div>
        </>
    );
};
