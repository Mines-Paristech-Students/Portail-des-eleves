import React from "react";

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

export const Tag = ({ type = "", tag, addon, ...props }) => {
    if (type === "") {
        type = types[hashCode(tag) % types.length];
    }
    let className = "mb-2 mr-2 tag tag-" + type;

    return (
        <div className={className}>
            {tag}
            <span className="tag-addon">{addon}</span>
        </div>
    );
};
