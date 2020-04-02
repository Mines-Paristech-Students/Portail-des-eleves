import React from "react";

export interface MessageData {
    username: string;
    message: string;
}

export const Message = (me: boolean, message: MessageData) => {
    let div_class = "w-100 p-3 d-flex flex-row";
    div_class += me ? "-reverse pl-5" : " pr-5";

    return (
        <div className={div_class}>
            <span className="avatar rounded-circle">
                {message.username}
            </span>
            <p className="mr-1 ml-1 border rounded-sm">
                {message.message}
            </p>
        </div>
    )
};