import React from "react";
import Badge from "react-bootstrap/Badge";

/**
 * Acts like an usual `Badge`, but with an automatic left margin so it fits nice
 * in a `SidebarItem`.
 */
export const SidebarBadge = ({ ...props }) => (
  <Badge className={`ml-auto ${props.className || ""}`} {...props} />
);
