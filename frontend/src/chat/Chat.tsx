import React, { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import { Message, MessageData } from "./Message";
import { api } from "../services/apiService";
import socketIOClient from "socket.io-client";

const chat_server_url = "http://localhost:3001";

function createSocket() {
    return api.jwt
        .getToken()
        .then((token: string) => {
            return io.connect(chat_server_url, {
                forceNew: true,
                query: "token=" + token
            });
        })
        .catch(() => {
            return undefined;
        });
}

export const Chat = () => {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [socket, setSocket] = useState<any>(null);

    const lastElementRef = useRef(null);
    const scrollToLastMessage = () => {
        // @ts-ignore
        lastElementRef.current.parentNode.scrollTo(
            0,
            // @ts-ignore
            lastElementRef.current.offsetTop
        );
    };

    const username: string = "17bocquet";

    useEffect(() => {
        (async () => {
            let token = await api.jwt.getToken();
            let socket = socketIOClient(chat_server_url, {
                forceNew: true,
                query: "token=" + token
            });

            setSocket(socket);

            let messages = socket.emit("fetch", {
                from: new Date(),
                limit: 20
            });
        })();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on("broadcast", data => {
                setMessages([...messages, data]);
                scrollToLastMessage();
            });

            socket.on("fetch_response", data => {
                let all_messages = [...messages, ...data];
                all_messages.sort((a, b) => a.date - b.date);
                setMessages(all_messages);
                scrollToLastMessage();
            });
        }
    }, [socket, messages]);

    let handleKeyPress = event => {
        if (
            socket &&
            event.key === "Enter" &&
            !event.shiftKey &&
            newMessage.trim().length > 0
        ) {
            socket.emit("message", { message: newMessage });
            setNewMessage("");
            event.preventDefault();
        }
    };

    return (
        <Card
            className={
                "mb-0 mr-md-3 ml-auto col-md-3 position-fixed fixed-bottom"
            }
        >
            <Card.Header
                className={"border-0 pb-0"}
                style={{ backgroundColor: "white", zIndex: 3, opacity: 0.9 }}
            >
                <Card.Title style={{ opacity: 0.9 }}>Chat</Card.Title>
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
                            style={{ paddingTop: "50px" }}
                        >
                            {messages.map((data: MessageData, index) => (
                                <Message
                                    id={index}
                                    key={index}
                                    me={username === data.username}
                                    message={data}
                                />
                            ))}

                            <div ref={lastElementRef} />
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
