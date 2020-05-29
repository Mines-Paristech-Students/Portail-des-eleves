import React from "react";
import { Size } from "../../../utils/size";
import { TablerColor } from "../../../utils/colors";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

/**
 * Display an avatar.
 * @param url optional, the URL to the avatar.
 * @param size optional, the size of the avatar, a `Size`. Defaults to `Large`.
 * @param backgroundColor optional, the color of the avatar, a `TablerColor`. Defaults to `Gray`.
 * @param className optional, the classes to add to `Avatar`.
 * @param tooltip optional, a tooltip to display when the avatar is hovered.
 * @param children optional, something to display in the avatar.
 * @param props optional, passed to the inner `span` element.
 */
export const Avatar = ({
    url = "",
    size = Size.Large,
    backgroundColor = TablerColor.Gray,
    className,
    tooltip,
    children,
    ...props
}: {
    url?: string;
    size?: Size;
    backgroundColor?: TablerColor;
    className?: string;
    tooltip?: string;
    children?: any;
    [prop: string]: any;
}) => {
    const avatar = (
        <span
            {...props}
            className={`avatar avatar-${size} avatar-${backgroundColor} ${
                className ? className : ""
            }`}
            style={{
                ...props.style,
                boxShadow: "0 2px 4px 0 hsla(0, 0%, 0%, 0.2)",
                backgroundImage: url ? `url(${url}.jpg)` : "",
            }}
        >
            {children}
        </span>
    );

    return tooltip ? (
        <OverlayTrigger
            placement={"bottom"}
            overlay={<Tooltip id={`tooltip-${url}`}>{tooltip}</Tooltip>}
        >
            {avatar}
        </OverlayTrigger>
    ) : (
        avatar
    );
};
