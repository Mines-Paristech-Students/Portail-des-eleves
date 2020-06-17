import React from "react";
import { RolePermission } from "../../../../models/associations/role";
import { OverlayTriggerProps } from "react-bootstrap";
import { RolePermissionTooltip } from "./RolePermissionTooltip";
import { RolePermissionIcon } from "./RolePermissionIcon";

export const RolePermissionIconTooltip = ({
  permission,
  iconProps,
  tooltipProps,
}: {
  permission: RolePermission;
  iconProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  >;
  tooltipProps?: Partial<OverlayTriggerProps>;
}) => (
  <RolePermissionTooltip permission={permission} {...tooltipProps}>
    <RolePermissionIcon permission={permission} {...iconProps} />
  </RolePermissionTooltip>
);
