import React from "react";
import { Link, useHistory } from "react-router-dom";
import { api, useBetterQuery } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../../utils/common";
import { Tag } from "../../../utils/Tag";
import { LoadingAssociation } from "../Loading";
import { Media } from "../../../models/associations/media";
import { Pagination } from "../../../utils/pagination";

export const AssociationFilesystemList = ({ association }) => {
    const associationId = association.id;
    const history = useHistory();

    let addButton;
    if (association.myRole.mediaPermission) {
        addButton = (
            <Link
                to={`/associations/${association.id}/files/upload`}
                className={"btn btn-success float-right mt-5"}
            >
                <i className="fe fe-upload" />
                Ajouter des fichiers
            </Link>
        );
    }

    return (
        <Pagination
            apiKey={"medias.list"}
            apiMethod={api.medias.list}
            apiParams={[associationId]}
            render={(medias, paginationControl) => (
                <>
                    {addButton}
                    <PageTitle className={"mt-6"}>Fichiers</PageTitle>
                    <Row>
                        {medias.map(media => {
                            return (
                                <Col md={4} key={media.id}>
                                    <Card
                                        onClick={() =>
                                            history.push(
                                                `/associations/${association.id}/files/${media.id}/`
                                            )
                                        }
                                    >
                                        <Card.Body>
                                            <h4>{media.name}</h4>
                                            <p className="text-muted">
                                                {media.description}
                                            </p>
                                            {media.tags.map(tag => (
                                                <Tag
                                                    key={tag.id}
                                                    tooltip={tag.namespace.name}
                                                    tag={tag.value}
                                                />
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                    {paginationControl}
                </>
            )}
        />
    );
};
