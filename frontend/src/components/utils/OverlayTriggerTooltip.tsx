import React from "react";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

/**
 * A Bootstrap `Tooltip` in an `OverlayTrigger` component.
 *
 * @param tooltip the text of the tooltip.
 * @param children the element to which the tooltip is applied.
 * @param props passed to `OverlayTrigger`.
 */
export const OverlayTriggerTooltip = ({
  tooltip,
  children,
  ...props
}: {
  tooltip: string;
  children: any;
  [prop: string]: any;
}) => (
  <OverlayTrigger
    placement="bottom"
    overlay={
      <Tooltip id={tooltip.toLowerCase().replace(/\W/g, "-")}>
        {tooltip}
      </Tooltip>
    }
    popperConfig={{
      modifiers: [
        {
          name: "offset",
          options: {
            offset: [0, 8],
          },
        },
      ],
    }}
    {...props}
  >
    {children}
  </OverlayTrigger>
);
