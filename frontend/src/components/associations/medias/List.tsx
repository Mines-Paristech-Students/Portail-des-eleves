import React from "react";
import { Link, useHistory } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { AssociationLayout } from "../Layout";

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

    // const additionalParams = useTagSearch(
    //     {
    //         page_size: 1000,
    //         scoped_to: "association",
    //         scoped_to_pk: associationId,
    //         related_to: "media",
    //     },
    //     setSidebar
    // );

    return (
        <AssociationLayout association={association}>
            <Pagination
                apiKey={["medias.list", associationId, {}]}
                apiMethod={api.medias.list}
                render={(medias, paginationControl) => (
                    <>
                        {addButton}
                        <PageTitle className={"mt-6"}>Fichiers</PageTitle>
                        <Row>
                            {medias.map((media) => {
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

                                                <TagList
                                                    model={TaggableModel.Media}
                                                    id={media.id}
                                                    collapsed={true}
                                                />
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
        </AssociationLayout>
    );
};
