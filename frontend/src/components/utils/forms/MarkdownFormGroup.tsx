import React, { useState } from "react";
import { TextFieldProps } from "./TextField";
import { BaseFormGroupProps } from "./BaseFormGroup";
import { TextFormGroup } from "./TextFormGroup";
import ReactMarkdown from "react-markdown";
import { useFormikContext } from "formik";
import Container from "react-bootstrap/Container";
import "./markdown-form-group.css";

const MarkdownPreview = ({ value }: { value: string }) => (
  <Container
    className="mb-3"
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
            >
              Markdown
            </a>{" "}
            est activé.{" "}
            {
              // See https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/anchor-is-valid.md#case-i-want-to-perform-an-action-and-need-a-clickable-ui-elementpreview &&
              showPreview ? (
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className="link-button"
                >
                  Désactiver la prévisualisation.
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className="link-button"
                >
                  Prévisualiser.
                </button>
              )
            }
          </>
        }
        as="textarea"
        {...props}
      />
      {preview && showPreview && <MarkdownPreview value={values[name]} />}
    </>
  );
};
