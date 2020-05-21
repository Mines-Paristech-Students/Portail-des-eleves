import React, { createContext, useEffect, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";

export enum ToastLevel {
    Success = "success",
    Error = "danger",
}

export type ToastInfo = {
    message: string;
    level: ToastLevel;
};

type SendToast = (toast: ToastInfo) => void;

export const ToastContext = createContext<SendToast>(() => {});

/* Two calls to the "newToast" function with the same parameters won't
 * trigger a new toast to show because the "useEffect" only depends on the message.
 * We introduce a "flip" variable that is changed when the function is called.
 * It is given as a dependency of the useEffect and thus will trigger a new toast to show.
 */
export const ToastProvider: React.FunctionComponent = ({ children }) => {
    const [toast, setToast] = useState<ToastInfo | null>(null);
    const [flip, setFlip] = useState(false);

    return (
        <>
            {toast && (
                <Toast message={toast.message} type={toast.level} flip={flip} />
            )}
            <ToastContext.Provider
                value={(value) => {
                    setToast(value);
                    setFlip(!flip);
                }}
            >
                {children}
            </ToastContext.Provider>
        </>
    );
};

export const Toast = ({ message: msg, type, flip }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState(msg);

    useEffect(() => {
        setShow(true);
        setMessage(msg);
    }, [msg, flip]);

    return (
        <BootstrapToast
            style={{
                position: "fixed",
                top: "50px",
                left: "50vw",
                transform: "translateX(-50%)",
                boxShadow:
                    "0 0 10px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.32)",
                zIndex: 9999,
            }}
            autohide
            delay={5000}
            onClose={() => {
                setShow(false);
            }}
            show={show}
        >
            <BootstrapToast.Body className={"text-" + type}>
                {message}
            </BootstrapToast.Body>
        </BootstrapToast>
    );
};
