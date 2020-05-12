import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const types = [
    "blue",
    "azure",
    "indigo",
    "purple",
    "pink",
    "orange",
    "yellow",
    "lime",
    "teal"
];

function hashCode(s) {
    let h = 0;
    for (let i = 0; i < s.length; i++)
        h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

export const Tag = ({
    type = "",
    tag = "",
    addon = "",
    tooltip = "",
}) => {
    if (type === "") {
        type = types[hashCode(tag) % types.length];
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
                placement={'bottom'}
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
