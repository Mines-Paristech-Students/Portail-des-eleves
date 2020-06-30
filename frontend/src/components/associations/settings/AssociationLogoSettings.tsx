import { Card } from "react-bootstrap";
import React, { useState } from "react";
import { MediaSelector } from "../../utils/MediaSelector";
import { api, useBetterQuery } from "../../../services/apiService";
import { queryCache } from "react-query";
import { Media } from "../../../models/associations/media";

export const AssociationLogoSettings = ({ association }) => {
  const { data: logo, status, error } = useBetterQuery<Media>(
    ["association.logo.get", association.logo],
    api.medias.get
  );

  const [showSelectModal, setShowSelectorModal] = useState(false);

  const onMediaChange = (media) => {
    api.associations.setLogo(association.id, media?.id || null).then(() => {
      queryCache.refetchQueries("association.get");
    });
  };

    console.log("a", logo);

  return (
    <Card>
      <Card.Header>
        <Card.Title>Logo</Card.Title>
      </Card.Header>
      <Card.Body className={"text-center"}>
        <p>
          {association.logo && logo ? (
            <img
              src={logo.url}
              alt={"Logo de l'association"}
              style={{ maxHeight: "300px" }}
            />
          ) : (
            "Aucun logo pour l'instant"
          )}
        </p>

        <button
          className="btn btn-primary"
          onClick={() => setShowSelectorModal(true)}
        >
          Séléctionner un logo
        </button>

        <MediaSelector
          association={association}
          imageOnly={true}
          setMedia={onMediaChange}
          media={logo}
          showModal={showSelectModal}
          setShowModal={setShowSelectorModal}
        />
      </Card.Body>
    </Card>
  );
};
