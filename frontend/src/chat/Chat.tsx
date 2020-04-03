import React, { useState, useContext } from "react";
import Card from "react-bootstrap/Card";
import { Message, MessageData } from "./Message";
import { socket } from "./Socket";
import { ToastContext, ToastLevel } from "../utils/Toast";

export const Chat = () => {
    const [messages, setMessages] = useState<MessageData[]>([
        { username: "17bocquet", time: new Date(), message: "un" },
        { username: "15plop", time: new Date(), message: "deux" },
        { username: "17bocquet", time: new Date(), message: "trois" },
        { username: "15plop", time: new Date(), message: "quatre" },
        { username: "17bocquet", time: new Date(), message: "cinq" },
        {
            username: "17bocquet",
            time: new Date(),
            message:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet velit eget tortor convallis maximus. Cras imperdiet ligula ut dolor dignissim, in sagittis ligula ultrices. Suspendisse suscipit, nulla nec elementum ultricies, neque sem malesuada lorem, vitae iaculis ex eros sit amet lacus. Vestibulum tellus orci, vehicula vel consequat vitae, interdum eget justo. Morbi aliquet feugiat pellentesque. Praesent placerat euismod ipsum, auctor efficitur diam commodo non. Aliquam non mi nisl. Suspendisse metus odio, sollicitudin porttitor tempor ac, gravida sed dolor. Sed eu massa vitae quam sagittis rutrum vel sed nibh. Nunc ultricies mi sit amet sapien iaculis, porttitor egestas eros accumsan."
        },
        {
            username: "15plop",
            time: new Date(),
            message:
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sit amet velit eget tortor convallis maximus. Cras imperdiet ligula ut dolor dignissim, in sagittis ligula ultrices. Suspendisse suscipit, nulla nec elementum ultricies, neque sem malesuada lorem, vitae iaculis ex eros sit amet lacus. Vestibulum tellus orci, vehicula vel consequat vitae, interdum eget justo. Morbi aliquet feugiat pellentesque. Praesent placerat euismod ipsum, auctor efficitur diam commodo non. Aliquam non mi nisl. Suspendisse metus odio, sollicitudin porttitor tempor ac, gravida sed dolor. Sed eu massa vitae quam sagittis rutrum vel sed nibh. Nunc ultricies mi sit amet sapien iaculis, porttitor egestas eros accumsan."
        },
        { username: "17bocquet", time: new Date(), message: "sept" }
    ]);
    const [newMessage, setNewMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const newToast = useContext(ToastContext);

    let handleKeyPress = event => {
        if (
            event.key === "Enter" &&
            !event.shiftKey &&
            newMessage.trim().length > 0
        ) {
            socket.emit("message", { message: newMessage });
            setNewMessage("");
            event.preventDefault();
        }
    };

    socket.on("broadcast", function(data: MessageData) {
        newToast({
            message: data.message,
            level: ToastLevel.Error
        });
        setMessages([...messages, data]);
    });

    const username: string = "15plop";

    return (
        <Card
            className={
                "mb-0 mr-md-3 ml-auto col-md-3 position-fixed fixed-bottom"
            }
        >
            <Card.Header className={"border-0 pb-0"} style={{ backgroundColor: "white", zIndex:3, opacity: 0.9}}>
                <Card.Title style={{opacity: 0.9}}>Chat</Card.Title>
                <div className="card-options">
                    <i
                        className={`fe ${
                            isCollapsed ? "fe-chevron-up" : "fe-chevron-down"
                        }`}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                    />
                </div>
            </Card.Header>
            {!isCollapsed ? (
                <>
                    <Card.Body style={{ height: "300px", marginTop: "-50px" }}>
                        <div
                            className="overflow-auto h-100 mt-2"
                            id="list-message"
                            style={{paddingTop:  "50px"}}
                        >
                            {messages.map((message: MessageData, index) => {
                                return Message(
                                    index,
                                    username === message.username,
                                    message
                                );
                            })}
                        </div>
                    </Card.Body>
                    <Card.Footer className={"border-0 mb-2 mt-4 py-0 px-0"}>
                        <div className="form-group m-0">
                            <div className="input-icon m-0">
                                <textarea
                                    className="form-control m-0"
                                    value={newMessage}
                                    style={{ resize: "none" }}
                                    onKeyDown={handleKeyPress}
                                    onKeyUp={handleKeyPress}
                                    onChange={e => {
                                        setNewMessage(e.target.value);
                                    }}
                                    rows={Math.min(
                                        newMessage.split("\n").length,
                                        10
                                    )}
                                />
                                <span className="input-icon-addon">
                                    <i className="fe fe-arrow-right" />
                                </span>
                            </div>
                        </div>
                    </Card.Footer>
                </>
            ) : null}
        </Card>
    );
};
