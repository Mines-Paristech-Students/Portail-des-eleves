import React from "react";

/**
 * A Timeline, like the one at https://preview.tabler.io/maps.html.
 *
 * @param children should be `TimelineItem` components.
 */
export const Timeline = ({ children }: { children: any }) => (
    <ul className="timeline">{children}</ul>
);
