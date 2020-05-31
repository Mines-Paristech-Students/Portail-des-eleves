import React from "react";
import { Link, useParams } from "react-router-dom";
import { api, useBetterQuery } from "../../../services/apiService";
import { PageTitle } from "../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { Media } from "../../../models/associations/media";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { Loading } from "../../utils/Loading";
import { ErrorMessage } from "../../utils/ErrorPage";
import { formatDate, formatTime } from "../../../utils/format";

export const AssociationFilesystemDetail = ({ association }) => {
    const { fileId } = useParams<{ fileId: string }>();
    const { data: media, status, error } = useBetterQuery<Media>(
        ["media.get", fileId],
        api.medias.get
    );

    return status === "loading" ? (
        <Loading />
    ) : status === "error" ? (
        <ErrorMessage>{`Une erreur est survenue: ${error}`}</ErrorMessage>
    ) : media ? (
        <div>
            {association.myRole.permissions?.includes("media") && (
                <Link
                    to={`/associations/${association.id}/fichiers/${media.id}/modifier`}
                    className={"btn btn-primary float-right"}
                >
                    Editer
                </Link>
            )}
            <PageTitle>
                <Link
                    to={`/associations/${association.id}/fichiers`}
                    className={"text-primary"}
                >
                    <i className={"fe fe-arrow-left"} />
                </Link>
                {media.name}
            </PageTitle>

            <TagList
                model={TaggableModel.Media}
                id={media.id}
                className={"my-2"}
            />

            <Card>
                <Card.Body>
                    {media.description && media.description.length > 0 ? (
                        media.description
                    ) : (
                        <em>Aucune description</em>
                    )}
                </Card.Body>
                <Card.Footer>
                    Mis en ligne le {formatDate(media.uploadedOn)} à{" "}
                    {formatTime(media.uploadedOn)}
                </Card.Footer>
            </Card>
            <a href={media.file} download className={"btn btn-primary"}>
                <i className="fe fe-download" /> Télécharger
            </a>
        </div>
    ) : null;
};
