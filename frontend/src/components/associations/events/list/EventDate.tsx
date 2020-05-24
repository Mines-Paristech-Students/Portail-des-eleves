import React from "react";
import { Event } from "../../../../models/associations/event";
import { formatDate, formatTime } from "../../../../utils/format";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

/**
 * Display a formatted event date, depending on whether or not startsAt and endsAt are the same day.
 */
export const EventDate = ({ event }: { event: Event }) => {
    if (
        event.startsAt.getFullYear() === event.endsAt.getFullYear() &&
        event.startsAt.getMonth() === event.endsAt.getMonth() &&
        event.startsAt.getDate() === event.endsAt.getDate()
    ) {
        return (
            <>
                {formatDate(event.startsAt)}, {formatTime(event.startsAt)} —{" "}
                {formatTime(event.endsAt)}
            </>
        );
    } else {
        return (
            <>
                <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                        <Tooltip id={`tooltip-${event.id}-start`}>
                            {formatDate(event.startsAt)},{" "}
                            {formatTime(event.startsAt)}
                        </Tooltip>
                    }
                >
                    <span>{formatDate(event.startsAt)}</span>
                </OverlayTrigger>{" "}
                —{" "}
                <OverlayTrigger
                    placement={"bottom"}
                    overlay={
                        <Tooltip id={`tooltip-${event.id}-end`}>
                            {formatDate(event.endsAt)},{" "}
                            {formatTime(event.endsAt)}
                        </Tooltip>
                    }
                >
                    <span>{formatDate(event.endsAt)}</span>
                </OverlayTrigger>
            </>
        );
    }
};
