import React from "react";
import { Link, useParams } from "react-router-dom";
import { api, useBetterQuery } from "../../../services/apiService";
import { PageTitle } from "../../utils/PageTitle";
import Card from "react-bootstrap/Card";
import { Tag } from "../../utils/Tag";
import { LoadingAssociation } from "../Loading";
import { Media } from "../../../models/associations/media";

export const AssociationFilesystemDetail = ({ association }) => {
    const { fileId } = useParams<{ fileId: string }>();
    const { data: media, status, error } = useBetterQuery<Media>(
        "media.get",
        api.medias.get,
        [fileId]
    );

    if (status === "loading") return <LoadingAssociation />;
    else if (status === "error") return `Something went wrong: ${error}`;
    else if (media) {
        let preview;
        if (media.type.startsWith("image")) {
            preview = (
                <img
                    src={media.media}
                    alt={media.name}
                    className={"mb-2 rounded"}
                />
            );
        }

        let editButton;
        if (association.myRole.mediaPermission) {
            editButton = (
                <Link
                    to={`/associations/${association.id}/files/${media.id}/edit`}
                    className={"btn btn-primary float-right"}
                >
                    Editer
                </Link>
            );
        }

        return (
            <div>
                {editButton}
                <PageTitle>
                    <Link
                        to={`/associations/${association.id}/files`}
                        className={"text-primary"}
                    >
                        <i className={"fe fe-arrow-left"} />
                    </Link>
                    {media.name}
                </PageTitle>

                {media.tags.map(tag => (
                    <Tag
                        key={tag.id}
                        addon={tag.value}
                        tag={tag.namespace.name}
                    />
                ))}

                {preview}

                <Card>
                    <Card.Body>
                        {media.description && media.description.length > 0 ? (
                            media.description
                        ) : (
                            <em>Aucune description</em>
                        )}
                    </Card.Body>
                    <Card.Footer>
                        Mis en ligne le {media.uploadedOn}
                    </Card.Footer>
                </Card>
                <a href={media.media} download className={"btn btn-primary"}>
                    <i className="fe fe-download" /> Télécharger
                </a>
            </div>
        );
    }

    return null;
};
