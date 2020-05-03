import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ErrorMessage } from "../../utils/ErrorPage";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { Link, useHistory, useParams } from "react-router-dom";
import { PageTitle } from "../../utils/PageTitle";
import { Tag } from "../../utils/tags/Tag";
import { ToastContext, ToastLevel } from "../../utils/Toast";
import { api, useBetterQuery } from "../../../services/apiService";
import { LoadingAssociation } from "../Loading";
import { Media } from "../../../models/associations/media";

export const AssociationFilesystemEdit = ({ association }) => {
    const { fileId } = useParams<{ fileId: string }>();
    const { data: media, status, error } = useBetterQuery<Media>(
        "media.get",
        api.medias.get,
        [fileId]
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

    const deleteFile = media => {
        if (!window.confirm("Supprimer le fichier ?")) {
            return;
        }

        api.medias
            .delete(media)
            .then(res => {
                newToast({
                    message: "Fichier supprimé ",
                    level: ToastLevel.Success
                });
                history.push(`/associations/${association.id}/files/`);
            })
            .catch(err => {
                newToast({
                    message: err.statusCode + " " + err.message,
                    level: ToastLevel.Error
                });
            });
    };

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error") return `Something went wrong: ${error}`;
    else if (media) {
        return (
            <Formik
                initialValues={media}
                onSubmit={(values, actions) => {
                    api.medias
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
                                `/associations/${association.id}/files/${media.id}/`
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

                        {media.tags.map(tag => (
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
                                Mis en ligne le {media.uploadedOn}
                            </Card.Footer>
                        </Card>

                        <Button
                            className={"btn-danger float-right"}
                            onClick={() => deleteFile(media)}
                        >
                            Supprimer
                        </Button>
                    </Form>
                )}
            </Formik>
        );
    }

    return null;
};
