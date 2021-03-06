import React from "react";
import { Link, useLocation } from "react-router-dom";
import { PageTitle } from "../PageTitle";

/**
 * A link displayed in the sidebar.
 *
 * @param icon the Bootstrap icon to display besides the sidebar item. It's the part after `fe-` in the class name of
 * the icon.
 * @param to the URL of the link.
 * @param children the children to render for the link.
 * @param muted true if the item should be muted in the sidebar. Used for disabled but accessible modules
 * @param exact defaults to `true`. If `true`, the link will be marked as `active` only if the location equals `to`.
 * Otherwise, it needs to equal `to` or to start with `${to}/` or `${to}#`.
 */
export const SidebarItem = ({
  icon,
  to,
  children,
  muted = false,
  exact = true,
}) => {
  const location = useLocation();
  const iconClassName = "fe fe-" + icon;

  return (
    <Link
      className={`list-group-item list-group-item-action d-flex align-items-center ${
        location.pathname === to ||
        (!exact &&
          (location.pathname.startsWith(`${to}/`) ||
            location.pathname.startsWith(`${to}#`)))
          ? "active"
          : ""
      }
      ${muted && "text-muted"}
      `}
      to={to}
    >
      <span className="icon mr-3">
        <i className={iconClassName} />
      </span>
      {children}
    </Link>
  );
};

/**
 * A vertical space. Its height can be configured with the `size` props.
 */
export const SidebarSpace = ({ size = 2 }: { size?: number }) => (
  <div className={`pb-${size} pt-${size}`} />
);

/**
 * A horizontal separator line.
 */
export const SidebarSeparator = () => <hr className="w-100" />;

export const Sidebar = ({ title, children, ...rest }) => {
  return (
    <>
      <PageTitle>{title}</PageTitle>
      <div className="list-group list-group-transparent mb-0">{children}</div>
    </>
  );
};
