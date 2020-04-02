import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export interface MessageData {
    username: string;
    message: string;
    posted_on: string;
}

export const Message = (index, me: boolean, message: MessageData) => {
    let div_class = "d-flex flex-row";
    div_class += me ? "-reverse pl-5 text-right" : " pr-5";
    let bg_class = me ? "bg-primary" : "bg-secondary";

    let time: Date = new Date(message.posted_on);

    return (
        <div className={div_class}>
            <p className="float-left">
                {/* todo: load user avatar */}
                <span className="avatar" style={{ backgroundImage: "url()" }} />
            </p>
            <OverlayTrigger
                placement={"top"}
                key={`time-message-${index}`}
                overlay={
                    <Tooltip id={`time-message-${index}`}>
                        { time.getHours()} : {('0' + time.getMinutes()).slice(-2)} {/* format 3 to 03 */}
                    </Tooltip>
                }
            >
                <p className={"py-1 px-2 mx-1 rounded text-white " + bg_class}>
                    {message.message}
                </p>
            </OverlayTrigger>
        </div>
    );
};
