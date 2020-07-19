import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { api } from "../../../services/apiService";
import { PageTitle } from "../../utils/PageTitle";
import { Pagination } from "../../utils/Pagination";
import { AssociationLayout } from "../Layout";
import { TagSearch } from "../../utils/tags/TagSearch";
import { SidebarSpace } from "../../utils/sidebar/Sidebar";
import "./list.css";
import { MediaPreviewCard } from "./PreviewCard";
import { SidebarInputSearch } from "../../utils/sidebar/SidebarInputSearch";
import { Instructions } from "../../utils/Instructions";
import { Card } from "react-bootstrap";

export const AssociationFilesystemList = ({ association }) => {
  const associationId = association.id;
  const history = useHistory();

  const [tagParams, setTagParams] = useState({});
  const [searchParams, setSearchParams] = useState({});

  return (
    <AssociationLayout
      association={association}
      additionalSidebar={
        <>
          <SidebarSpace />
          <SidebarInputSearch
            setParams={setSearchParams}
            placeholder={"Chercher par nom ou desc."}
          />
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
          { page_size: 30, ...tagParams, ...searchParams },
        ]}
        apiMethod={api.medias.list}
        render={(medias, paginationControl) => (
          <>
            <div className="d-flex align-items-center">
              <PageTitle >Fichiers</PageTitle>
              {association.myRole.permissions?.includes("media") && (
                <Link
                  to={`/associations/${association.id}/fichiers/televerser`}
                  className={"btn btn-success btn-sm float-right ml-auto"}
                >
                  <span className="fe fe-upload" /> Ajouter des fichiers
                </Link>
              )}
            </div>

            <div className={"card-columns"}>
              {medias.map((media) => (
                <MediaPreviewCard
                  media={media}
                  onClick={() =>
                    history.push(
                      `/associations/${association.id}/fichiers/${media.id}/`
                    )
                  }
                />
              ))}
            </div>
            {paginationControl}

            {medias.length === 0 &&
              (Object.entries(tagParams).length === 0 ? (
                <Instructions
                  title={"Gestion des médias"}
                  emoji={"🗂️"}
                  emojiAriaLabel="Des fiches cartonnées"
                >
                  Aucun fichier pour l'instant.{" "}
                  {association.myRole.permissions?.includes("media") ? (
                    <Link
                      to={`/associations/${association.id}/fichiers/televerser`}
                    >
                      Ajoutez des fichiers pour débuter.
                    </Link>
                  ) : (
                    "Revenez quand les responsables de l'association en auront ajouté !"
                  )}
                </Instructions>
              ) : (
                <Card className="text-center lead">
                  <Card.Body>Aucun fichier trouvé</Card.Body>
                </Card>
              ))}
          </>
        )}
      />
    </AssociationLayout>
  );
};
