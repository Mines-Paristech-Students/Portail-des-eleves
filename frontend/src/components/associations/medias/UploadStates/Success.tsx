import React, { useContext, useState } from "react";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { useFormik } from "formik";
import { api } from "../../../../services/apiService";
import Card from "react-bootstrap/Card";
import { Button, Form } from "react-bootstrap";
import { TaggableModel, TagList } from "../../../utils/tags/TagList";

// Sub-component used to edit information on a media once its upload is done
export const FileUploadSuccess = ({ media, onDelete }) => {
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
    const newToast = useContext(ToastContext);

    const formik = useFormik({
        // Use a form to edit name and description
        initialValues: media,
        onSubmit: (values) => {
            newToast({
                message: "Sauvegarde en cours",
                level: ToastLevel.Success,
            });
            api.medias
                .patch({
                    id: values.id,
                    name: values.name,
                    description: values.description,
                })
                .then((res) => {
                    newToast({
                        message: "Fichier sauvegardé !",
                        level: ToastLevel.Success,
                    });
                })
                .catch((err) => {
                    newToast({
                        message: err.message,
                        level: ToastLevel.Error,
                    });
                });
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>
            <Card className={"mt-3"}>
                <div className="input-group border-0">
                    <span className="input-group-prepend border-0">
                        <span className="input-group-text border-0">
                            <span role={"img"} aria-label={"check"}>
                                ✅
                            </span>{" "}
                        </span>
                    </span>
                    <Form.Control
                        id="name"
                        name="name"
                        type="text"
                        className={"border-0"}
                        placeholder="Nom du fichier"
                        onChange={formik.handleChange}
                        value={formik.values.name}
                    />
                    <span className="input-group-append border-0">
                        <span className="input-group-text border-0">
                            {isCollapsed ? (
                                <i
                                    className="fe fe-chevron-down"
                                    onClick={() => setIsCollapsed(false)}
                                />
                            ) : (
                                <i
                                    className="fe fe-chevron-up"
                                    onClick={() => setIsCollapsed(true)}
                                />
                            )}
                        </span>
                    </span>
                </div>
                {!isCollapsed ? (
                    <>
                        <textarea
                            id={"description"}
                            name={"description"}
                            className={
                                "form-control border-bottom-0 border-left-0 border-right-0"
                            }
                            placeholder={"Description"}
                            onChange={formik.handleChange}
                            value={formik.values.description}
                        />
                        <Card.Footer>
                            <Button
                                size="sm"
                                variant="danger"
                                className={"float-right mx-1"}
                                onClick={() =>
                                    window.confirm("Supprimer le fichier ?") &&
                                    onDelete()
                                }
                            >
                                Supprimer
                            </Button>
                            <Button
                                size="sm"
                                variant="success"
                                className={"float-right mx-1"}
                                type="submit"
                            >
                                Sauvegarder
                            </Button>
                            <TagList
                                model={TaggableModel.Media}
                                id={media.id}
                            />
                        </Card.Footer>
                    </>
                ) : null}
            </Card>
        </form>
    );
};
