import React, { useState } from "react";
import { TextFieldProps } from "./TextField";
import { BaseFormGroupProps } from "./BaseFormGroup";
import { TextFormGroup } from "./TextFormGroup";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { useFormikContext } from "formik";
import Container from "react-bootstrap/Container";

const MarkdownPreview = ({ value }: { value: string }) => (
    <Container
        style={{
            border: "1px solid #e9ecef",
            borderRadius: "3px",
            padding: "0.375rem 0.75rem",
            textAlign: value ? "left" : "center",
        }}
    >
        {value ? (
            <ReactMarkdown source={value} />
        ) : (
            <span className="text-muted font-italic">Pas de contenu.</span>
        )}
    </Container>
);

/**
 * A `TextFormGroup` component with an optional Markdown previewing component.
 *
 * Please note that the previewing uses `values[name]` from the Formik context.
 *
 * @param name the name of the control, given to Formik's `useField`.
 * @param label optional, the label of the form control.
 * @param help optional, a text to display below the form control. A Markdown-
 * specific help text is appended, as well as a link to toggle the Markdown
 * previewing (if `preview` is `true`).
 * @param preview defaults to `true`. If `true`, display a previewing component.
 * @param props passed to `TextFormGroup`, see its doc for further details.
 */
export const MarkdownFormGroup = ({
    name,
    help,
    preview = true,
    ...props
}: TextFieldProps & BaseFormGroupProps & { preview?: boolean }) => {
    const { values } = useFormikContext<any>();
    const [showPreview, setShowPreview] = useState(false);

    return (
        <>
            <TextFormGroup
                name={name}
                help={
                    <>
                        {help && (
                            <>
                                {help}
                                <br />
                            </>
                        )}
                        Le{" "}
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://guides.github.com/features/mastering-markdown/#syntax"
                            className="text-reset"
                        >
                            Markdown
                        </a>{" "}
                        est activé.{" "}
                        {preview &&
                            (showPreview ? (
                                <Link
                                    to="#"
                                    onClick={() => setShowPreview(false)}
                                >
                                    Désactiver la prévisualisation.
                                </Link>
                            ) : (
                                <Link
                                    to="#"
                                    onClick={() => setShowPreview(true)}
                                >
                                    Prévisualiser.
                                </Link>
                            ))}
                    </>
                }
                {...props}
            />
            {preview && showPreview && <MarkdownPreview value={values[name]} />}
        </>
    );
};
