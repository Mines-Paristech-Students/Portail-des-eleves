import React, { useContext } from "react";

export const Message = ({ me, sender, content }) => {
    useContext();
    
    let div_class = "w-100 p-3 d-flex flex-row";
    div_class += me ? "-reverse pl-5" : " pr-5";

    return (
            <div className={div_class}>
                <span className="avatar rounded-circle">
                    {sender}
                </span>
                <p className="mr-1 ml-1 border rounded-sm">{content}</p>
            </div>
    )
};