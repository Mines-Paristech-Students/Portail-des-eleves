import React, { createContext, useEffect, useState } from "react";
import BootstrapToast from "react-bootstrap/Toast";

export enum ToastLevel {
    Error = "danger",
    Info = "info",
    Primary = "primary",
    Secondary = "secondary",
    Success = "success",
    Warning = "warning",
}

export type ToastInfo = {
    message: string;
    level: ToastLevel;
    delay?: Number;
};

type ToastSenders = {
    sendToast: (message: string, level?: ToastLevel) => void;
    sendSuccessToast: (message: string) => void;
    sendErrorToast: (message: string) => void;
};

/**
 * This context gives access to `sendToast`, a function taking a `message` and a `ToastLevel`.
 * The default `ToastLevel` is `ToastLevel.Success`.
 *
 * It also gives access to two shortcuts, `sendSuccessToast` and `sendErrorToast`.
 *
 * Examples:
 * ```
 * { sendToast, sendSuccessToast, sendErrorToast } = useContext(ToastContext);
 *
 * sendToast("Piche."); // ToasLevel.Success by default.
 * sendToast("Poche.", ToastLevel.Error);
 * sendSuccessToast("Biche.");
 * sendErrorToast("Bûche.");
 * ```
 */
export const ToastContext = createContext<ToastSenders>({
    sendToast: () => {},
    sendSuccessToast: () => {},
    sendErrorToast: () => {},
});

/* Two calls to the "newToast" function with the same parameters won't
 * trigger a new toast to show because the "useEffect" only depends on the message.
 * We introduce a "flip" variable that is changed when the function is called.
 * It is given as a dependency of the useEffect and thus will trigger a new toast to show.
 */
export const ToastProvider: React.FunctionComponent = ({ children }) => {
    const [toast, setToast] = useState<ToastInfo | null>(null);
    const [flip, setFlip] = useState(false);

    const sendToast = (message: string, level = ToastLevel.Success) => {
        setToast({
            message,
            level,
        });
        setFlip(!flip);
    };

    const sendSuccessToast = (message: string) => {
        setToast({
            message,
            level: ToastLevel.Success,
        });
        setFlip(!flip);
    };

    const sendErrorToast = (message: string) => {
        setToast({
            message,
            level: ToastLevel.Error,
        });
        setFlip(!flip);
    };

    return (
        <>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.level}
                    flip={flip}
                    delay={toast.delay}
                />
            )}
            <ToastContext.Provider
                value={{ sendToast, sendSuccessToast, sendErrorToast }}
            >
                {children}
            </ToastContext.Provider>
        </>
    );
};

export const Toast = ({ message: msg, type, flip, delay }) => {
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
