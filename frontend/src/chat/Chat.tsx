import React, { useState, useEffect, useRef } from "react";
import Card from "react-bootstrap/Card";
import { Message, MessageData } from "./Message";
import { api } from "../services/apiService";
import socketIOClient from "socket.io-client";

const chat_server_url = "http://localhost:3001";

export const Chat = () => {
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [socket, setSocket] = useState<any>(null);
    const [date, setDate] = useState<string>((new Date).toISOString());
    const [fetching, setFetching] = useState<boolean>(false);

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

    const fetchMessages = async () => {
        if (socket && (!fetching)) {
            setFetching(true);
            socket.emit("fetch", {
                from: new Date(date),
                limit: 20
            });
        }
    }

    const scrollFetch = async () => {
        // @ts-ignore
        if (lastElementRef.current.parentNode.scrollTop <= 150) {
            fetchMessages();
        }
    };

    useEffect(() => {
        (async () => {
            let token = await api.jwt.getToken();
            let socket = socketIOClient(chat_server_url, {
                forceNew: true,
                query: "token=" + token
            });

            setSocket(socket);

            setFetching(true);
            socket.emit("fetch", {
                from: date,
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

            // No sort needed -> Messages arrive in order
            socket.on("fetch_response", async (data: MessageData[]) => {
                let all_messages = [...messages, ...data];
                setDate(all_messages[all_messages.length - 1].posted_on);
                setFetching(false);
                setMessages(all_messages);
                scrollToLastMessage();
            });
        }
    }, [socket, messages]);

    let handleKeyPress = (event) => {
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
                            onScroll={scrollFetch}
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
