import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";

export const SidebarSection = ({
    retractable,
    title,
    retractedByDefault,
    children,
    ...props
}) => {
    const [isRetracted, setIsRetracted] = useState(false);

    useEffect(() => {
        /* If the user cannot change the state of the section (retracted or not)
         * the section should always be visible independently from the default,
         * hence the "&& retractable"
         */
        setIsRetracted(retractedByDefault && retractable);
        // eslint-disable-next-line
    }, [retractedByDefault]);

    return (
        <Form.Group {...props}>
            <Form.Label
                className="text-uppercase"
                onClick={() => {
                    retractable && setIsRetracted(!isRetracted);
                }}
            >
                {retractable && (
                    <span
                        className={`float-right pt-1 fe ${
                            isRetracted ? "fe-chevron-up" : "fe-chevron-down"
                        }`}
                    />
                )}
                {title}
            </Form.Label>

            {!isRetracted && children}
        </Form.Group>
    );
};
