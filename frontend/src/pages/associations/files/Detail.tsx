import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { api } from "../../../services/apiService";
import { PageTitle } from "../../../utils/common";
import Card from "react-bootstrap/Card";
import { Tag } from "../../../utils/Tag";

export const AssociationFilesystemDetail = ({ association }) => {
    const { fileId } = useParams();
    const { data: file, isLoading, error } = useQuery(
        ["file.get", { fileId }],
        api.files.get
    );

    if (isLoading) return "Loading association...";
    if (error) return `Something went wrong: ${error.message}`;
    if (file) {
        let preview;
        if (file.type.startsWith("image")) {
            preview = (
                <img
                    src={file.file}
                    alt={file.name}
                    className={"mb-2 rounded"}
                />
            );
        }

        let editButton;
        if (association.myRole.mediaPermission) {
            editButton = (
                <Link
                    to={`/associations/${association.id}/files/${file.id}/edit`}
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
                    {file.name}
                </PageTitle>

                {file.tags.map(tag => (
                    <Tag
                        key={tag.id}
                        addon={tag.value}
                        tag={tag.namespace.name}
                    />
                ))}

                {preview}

                <Card>
                    <Card.Body>
                        {file.description && file.description.length > 0 ? (
                            file.description
                        ) : (
                            <em>Aucune description</em>
                        )}
                    </Card.Body>
                    <Card.Footer>Mis en ligne le {file.uploadedOn}</Card.Footer>
                </Card>
                <a href={file.file} download className={"btn btn-primary"}>
                    <i className="fe fe-download" /> Télécharger
                </a>
            </div>
        );
    }

    return null;
};
