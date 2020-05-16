import React from "react";
import { TimelineItem, TimelineItemProps } from "./TimelineItem";

/**
 * A Timeline, like the one at https://preview.tabler.io/maps.html.
 *
 * @param items an array of objects to be passed to `TimelineItem`.
 */
export const Timeline = ({ items }: { items: TimelineItemProps[] }) => (
    <ul className="timeline">
        {items.map(({ badgeColor, content, startDate, endDate }, index) => (
            <TimelineItem
                key={index}
                badgeColor={badgeColor}
                content={content}
                startDate={startDate}
                endDate={endDate}
            />
        ))}
    </ul>
);
