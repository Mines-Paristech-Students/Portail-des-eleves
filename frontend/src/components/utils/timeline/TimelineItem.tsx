import React from "react";
import { TablerColor } from "../../../utils/colors";
import { formatLongDateMonthYear } from "../../../utils/format";

/**
 * A Timeline item, like the ones at https://preview.tabler.io/maps.html.
 *
 * @param badgeColor should be chosen among the Tabler colors and is the color of the timeline badge (the "dot" on the left of the timeline). Defaults to Blue.
 * @param content optional, the component to be rendered between the badge and the time.
 * @param startDate optional, the date to display on the right.
 * @param endDate optional. Only displayed if `startDate` is also provided. Displays an end date on the right of the startDate.
 */
export const TimelineItem = ({
    badgeColor = TablerColor.Blue,
    content,
    startDate,
    endDate,
}: {
    badgeColor?: TablerColor;
    content?: any;
    startDate?: Date;
    endDate?: Date;
}) => (
    <li className="timeline-item">
        <div className={`timeline-badge bg-${badgeColor}`}></div>
        {content && content}
        {startDate && (
            <div className="timeline-time">
                {formatLongDateMonthYear(startDate)}
                {endDate && ` — ${formatLongDateMonthYear(endDate)}`}
            </div>
        )}
    </li>
);
