import React from "react";
import { Link } from "react-router-dom";

/**
 * A link displayed in the sidebar. It has three props:
 *   * `icon`: the Bootstrap icon to display besides the sidebar item. It's the
 *   part after `fe-` in the class name of the icon.
 *   * `to`: the URL of the link.
 *   * `children`: the children to render for the link.
 */
export const SidebarItem = ({ icon, to, children }) => {
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

export const SidebarSeparator = (props: { size?: number }) => {
    let size = props.size ? props.size : 2;

    return <p className={`mb-${size} mt-${size}`}></p>;
};

export const Sidebar = ({ title, children, ...rest }) => {
    return (
        <>
            <h1 className="page-title mb-5">{title}</h1>
            <div className="list-group list-group-transparent mb-0">
                {children}
            </div>
        </>
    );
};
