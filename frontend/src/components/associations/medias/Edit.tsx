import React, { useContext } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { ErrorMessage, ForbiddenError } from "../../utils/ErrorPage";
import { Form } from "react-bootstrap";
import { Formik } from "formik";
import { Link, useHistory, useParams } from "react-router-dom";
import { PageTitle } from "../../utils/PageTitle";
import { ToastContext } from "../../utils/Toast";
import { api, useBetterQuery } from "../../../services/apiService";
import { LoadingAssociation } from "../Loading";
import { Media } from "../../../models/associations/media";
import { TaggableModel } from "../../utils/tags/TagList";
import { TagEdition } from "../../utils/tags/TagEdition";

export const AssociationFilesystemEdit = ({ association }) => {
    const { fileId } = useParams<{ fileId: string }>();
    const { data: media, status, error } = useBetterQuery<Media>(
        ["media.get", fileId],
        api.medias.get
    );

    const history = useHistory();
    const { sendSuccessToast, sendErrorToast } = useContext(ToastContext);

    if (!association.myRole.permissions?.includes("media")) {
        return <ForbiddenError />;
    }

    const deleteFile = (media) => {
        if (!window.confirm("Supprimer le fichier ?")) {
            return;
        }

        api.medias
            .delete(media)
            .then((res) => {
                sendSuccessToast("Fichier supprimé ");
                history.push(`/associations/${association.id}/fichiers/`);
            })
            .catch((err) => {
                sendErrorToast(err.statusCode + " " + err.message);
            });
    };

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error")
        return <ErrorMessage details={`Something went wrong: ${error}`} />;
    else if (media) {
        return (
            <Formik
                initialValues={media}
                onSubmit={(values, actions) => {
                    api.medias
                        .patch({
                            id: values.id,
                            name: values.name,
                            description: values.description,
                        })
                        .then((res) => {
                            sendSuccessToast("Sauvegardé : " + res.name);
                            history.push(
                                `/associations/${association.id}/fichiers/${media.id}/`
                            );
                        })
                        .catch((err) =>
                            sendErrorToast(err.statusCode + " " + err.message)
                        );
                }}
            >
                {(formik) => (
                    <Form onSubmit={formik.handleSubmit}>
                        <PageTitle>
                            <Link
                                to={`/associations/${association.id}/fichiers`}
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

                        <TagEdition model={TaggableModel.Media} id={media.id} />

                        <Card className={"mt-3"}>
                            <textarea
                                id={"description"}
                                name={"description"}
                                className={"form-control border-0"}
                                placeholder={"Description"}
                                onChange={formik.handleChange}
                                value={formik.values.description || ""}
                            />
                        </Card>

                        <Button
                            className={"btn-success float-right"}
                            type="submit"
                        >
                            Sauvegarder
                        </Button>

                        <Button
                            className={"btn-danger"}
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
