import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { hashCode } from "../../../utils/hashcode";
import { tablerColors } from "../../../utils/colors";

/**
 * @param type the boostrap style of the tag
 * @param tag the main value of the tag
 * @param addon additional information, displayed on the right
 * @param tooltip on hoover information
 * @param collapsed true if we want the tag to take less space. In that case,
 * the tag goes in the tooltip.
 */
export const Tag = ({
    type = "",
    tag = "",
    addon = "",
    tooltip = "",
    collapsed = false,
}) => {
    if (type === "") {
        type = tablerColors[hashCode(tag) % tablerColors.length];
    }

    if (collapsed) {
        tooltip = tag;
        tag = addon;
        addon = "";
    }

    let className = "mb-2 mr-2 tag tag-" + type;
    let tagElement = (
        <div className={className}>
            {tag}
            {addon.length !== 0 ? (
                <span className="tag-addon">{addon}</span>
            ) : null}
        </div>
    );

    if (tooltip.length > 0) {
        return (
            <OverlayTrigger
                key={type + addon + tooltip + tag}
                placement={"bottom"}
                overlay={
                    <Tooltip id={type + addon + tooltip + tag}>
                        {tooltip}
                    </Tooltip>
                }
            >
                {tagElement}
            </OverlayTrigger>
        );
    } else {
        return tagElement;
    }
};
