import React from "react";
import OverlayTrigger, {
  OverlayTriggerProps,
} from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { RolePermission } from "../../../../models/associations/role";

const tooltips = {
  administration: "Administration",
  election: "Élections",
  event: "Événements",
  media: "Fichiers",
  library: "Bibliothèque",
  marketplace: "Magasin",
  page: "Pages",
};

/**
 * Display a permission tooltip. Usually used through `RolePermissionIconTooltip`, but this component may be useful for
 * applying the overlay to a bigger component.
 *
 * @param permission choose among `RolePermission`.
 * @param children the node which should be surrounded by the overlay trigger.
 * @param props passed to `OverlayTrigger`. By default, `placement="bottom"`, `delay={show: 200, hide: 0}` and
 * `overlay` is the tooltip.
 */
export const RolePermissionTooltip = ({
  permission,
  children,
  ...props
}: {
  permission: RolePermission;
  children: React.ReactNode;
} & Partial<OverlayTriggerProps>) => (
  <OverlayTrigger
    placement="bottom"
    delay={{ show: 200, hide: 0 }}
    overlay={
      <Tooltip id={`${permission}-tooltip`}>{tooltips[permission]}</Tooltip>
    }
    {...props}
  >
    {children}
  </OverlayTrigger>
);
