import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { api } from "../../../services/apiService";
import Card from "react-bootstrap/Card";
import { Col } from "react-bootstrap";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import { AssociationLayout } from "../Layout";
import { TagSearch } from "../../utils/tags/TagSearch";
import { SidebarSpace } from "../../utils/sidebar/Sidebar";
import { Instructions } from "../../utils/Instructions";

export const AssociationFilesystemList = ({ association }) => {
    const associationId = association.id;
    const history = useHistory();

    const [tagParams, setTagParams] = useState({});
    return (
        <AssociationLayout
            association={association}
            additionalSidebar={
                <>
                    <SidebarSpace />
                    <TagSearch
                        tagsQueryParams={{
                            page_size: 1000,
                            namespace__scoped_to_model: "association",
                            namespace__scoped_to_pk: associationId,
                            related_to: "media",
                        }}
                        setTagParams={setTagParams}
                    />
                </>
            }
        >
            <Pagination
                apiKey={[
                    "medias.list",
                    associationId,
                    { page_size: 30, ...tagParams },
                ]}
                apiMethod={api.medias.list}
                render={(medias, paginationControl) => (
                    <>
                        {association.myRole.permissions?.includes("media") && (
                            <Link
                                to={`/associations/${association.id}/fichiers/televerser`}
                                className={"btn btn-success float-right mt-3"}
                            >
                                <span className="fe fe-upload" /> Ajouter des
                                fichiers
                            </Link>
                        )}
                        <PageTitle className={"mt-6"}>Fichiers</PageTitle>
                        <div className={"card-columns"}>
                            {medias.map((media) => {
                                return (
                                    <Col key={media.id}>
                                        <Card
                                            onClick={() =>
                                                history.push(
                                                    `/associations/${association.id}/fichiers/${media.id}/`
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
                                                    instance={media}
                                                    collapsed={true}
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </div>
                        {medias.length === 0 &&
                            Object.entries(tagParams).length === 0 && (
                                <Instructions
                                    title={"Gestion des médias"}
                                    emoji={"🗂️"}
                                    emojiAriaLabel="Des fiches cartonnées"
                                >
                                    Aucun fichier pour l'instant.{" "}
                                    {association.myRole.permissions?.includes(
                                        "media"
                                    ) ? (
                                        <Link
                                            to={`/associations/${association.id}/fichiers/televerser`}
                                        >
                                            Ajoutez des fichiers pour débuter.
                                        </Link>
                                    ) : (
                                        "Revenez quand les responsables de l'association en auront ajouté !"
                                    )}
                                </Instructions>
                            )}

                        {paginationControl}

                        {medias.length === 0 &&
                            Object.entries(tagParams).length > 0 && (
                                <Card className="text-center lead">
                                    <Card.Body>Aucun fichier trouvé</Card.Body>
                                </Card>
                            )}
                    </>
                )}
            />
        </AssociationLayout>
    );
};
