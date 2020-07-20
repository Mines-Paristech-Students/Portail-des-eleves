import React from "react";
import { Link } from "react-router-dom";

/**
 * Display a clickable arrow icon.
 * @param to the target of the link.
 * @param props passed to the underlying `Link` component.
 */
export const ArrowLink = ({
  to,
  ...props
}: {
  to: string;
  [prop: string]: any;
}) => (
  <Link
    to={to}
    className="text-decoration-none mr-2"
    // Fixes the alignment when used in a `PageTitle`.
    style={{ position: "relative", top: "1px" }}
    {...props}
  >
    <i className="fe fe-arrow-left" />
  </Link>
);
