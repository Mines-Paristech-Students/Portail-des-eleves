import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { UserAvatar } from "../components/utils/avatar/UserAvatar";
import { Size } from "../utils/size";

export interface MessageData {
  username: string;
  message: string;
  posted_on: string;
}

export const Message = ({
  id,
  me,
  message,
}: {
  id: number;
  me: boolean;
  message: MessageData;
}) => {
  let div_class = "d-flex flex-row";
  div_class += me ? "-reverse pl-5 text-right" : " pr-5";
  let bg_class = me ? "bg-primary" : "bg-secondary";

  let time: Date = new Date(message.posted_on);

  return (
    <div className={div_class}>
      <OverlayTrigger
        placement={"top"}
        key={`avatar-message-${id}`}
        overlay={
          <Tooltip id={`avatar-message-${id}`}>{message.username}</Tooltip>
        }
      >
        <p className="float-left">
          <UserAvatar userId={message.username} size={Size.Small} link={true} />
        </p>
      </OverlayTrigger>
      <OverlayTrigger
        placement={"top"}
        key={`time-message-${id}`}
        overlay={
          <Tooltip id={`time-message-${id}`}>
            {time.getHours()} : {("0" + time.getMinutes()).slice(-2)}{" "}
            {/* format 3 to 03 */}
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
