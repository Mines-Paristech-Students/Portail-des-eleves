import React, { useContext } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { PageTitle } from "../../../utils/common";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { ErrorMessage } from "../../ErrorPage";
import { Tag } from "../../../utils/Tag";
import { ToastContext, ToastLevel } from "../../../utils/Toast";
import { Formik } from "formik";
import { Form } from "react-bootstrap";

export const AssociationFilesystemEdit = ({ association }) => {
    const { fileId } = useParams();
    const { data: file, isLoading, error } = useQuery(
        ["file.get", { fileId }],
        api.files.get
    );

    const history = useHistory();
    const newToast = useContext(ToastContext);

    if (!association.myRole.mediaPermission) {
        return (
            <ErrorMessage>
                Vous ne pouvez pas modifier ce fichier car vous n'avez pas les
                droits requis pour {association.name}
            </ErrorMessage>
        );
    }

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (file) {
        return (
            <Formik
                initialValues={file}
                onSubmit={(values, actions) => {
                    api.files
                        .patch({
                            id: values.id,
                            name: values.name,
                            description: values.description
                        })
                        .then(res => {
                            newToast({
                                message: "Sauvegardé : " + res.name,
                                level: ToastLevel.Success
                            });
                            history.push(
                                `/associations/${association.id}/files/${file.id}/`
                            );
                        })
                        .catch(err =>
                            newToast({
                                message: err.statusCode + " " + err.message,
                                level: ToastLevel.Error
                            })
                        );
                }}
            >
                {formik => (
                    <Form onSubmit={formik.handleSubmit}>
                        <Button
                            className={"btn-success float-right"}
                            type="submit"
                        >
                            Sauvegarder
                        </Button>
                        <PageTitle>
                            <Link
                                to={`/associations/${association.id}/files`}
                                className={"text-primary float-left"}
                            >
                                <i className={"fe fe-arrow-left"} />
                            </Link>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                className="my-2 form-control"
                                placeholder="Titre"
                                autoComplete={"off"}
                                onChange={formik.handleChange}
                                value={formik.values.name}
                            />
                        </PageTitle>

                        {file.tags.map(tag => (
                            <Tag
                                key={tag.id}
                                addon={tag.value}
                                tag={tag.namespace.name}
                            />
                        ))}

                        <Card>
                            <textarea
                                id={"description"}
                                name={"description"}
                                className={"form-control border-0"}
                                placeholder={"Description"}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                            />
                            <Card.Footer>
                                Mis en ligne le {file.uploadedOn}
                            </Card.Footer>
                        </Card>
                    </Form>
                )}
            </Formik>
        );
    }

    return null;
};
