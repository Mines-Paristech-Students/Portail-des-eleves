import React, { createContext, useEffect, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";

export enum ToastLevel {
    Success = "success",
    Error = "danger"
}

export type ToastInfo = {
    message: string;
    level: ToastLevel;
};

type SendToast = (toast: ToastInfo) => void;

export const ToastContext = createContext<SendToast>(() => {});

export const ToastProvider: React.FunctionComponent = ({ children }) => {
    const [toast, setToast] = useState<ToastInfo | null>(null);

    return (
        <>
            {toast && <Toast message={toast.message} type={toast.level} />}
            <ToastContext.Provider value={setToast}>
                {children}
            </ToastContext.Provider>
        </>
    );
};

export const Toast = ({ message: msg, type }) => {
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState(msg);

    useEffect(() => {
        setShow(true);
        setMessage(msg);
    }, [msg]);

    return (
        <BootstrapToast
            style={{
                position: "fixed",
                top: "50px",
                left: "50vw",
                transform: "translateX(-50%)",
                boxShadow:
                    "0 0 10px rgba(0, 0, 0, 0.1), 0 1px 4px rgba(0, 0, 0, 0.32)"
            }}
            autohide
            delay={1000}
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
