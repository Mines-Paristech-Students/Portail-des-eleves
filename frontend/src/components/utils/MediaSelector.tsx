import { api, useBetterQuery } from "../../services/apiService";
import { PageTitle } from "./PageTitle";
import { Link } from "react-router-dom";
import Card from "react-bootstrap/Card";
import { TaggableModel, TagList } from "./tags/TagList";
import { Pagination } from "./Pagination";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { MediaPreviewCard } from "../associations/medias/PreviewCard";
import { Media } from "../../models/associations/media";
import Button from "react-bootstrap/Button";

export const MediaSelector = ({
  association,
  imageOnly,
  setMedia,
  media,
  showModal,
  setShowModal,
}) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    setSelectedMedia(media)
  }, [media]);

  console.log("b", selectedMedia);

  return (
    <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Body>
        <Pagination
          apiKey={[
            "medias.list",
            association.id,
            {
              page_size: 30,
              mimetype__contains:
                imageOnly && "image" /*...tagParams, ...dateParams*/,
            },
          ]}
          apiMethod={api.medias.list}
          render={(medias, paginationControl) => (
            <>
              <div className={"container"}>
                {medias.map((media: Media) => (
                  <div className={"col col-lg-3 col-md-4"} key={media.id}>
                    <MediaPreviewCard
                      media={media}
                      showDescription={false}
                      onClick={() =>
                        selectedMedia && media.id == selectedMedia.id
                          ? setSelectedMedia(null)
                          : setSelectedMedia(media)
                      }
                      style={
                        selectedMedia && media.id == selectedMedia.id
                          ? { border: "2px solid var(--blue)" }
                          : {}
                      }
                    />
                  </div>
                ))}
              </div>
              {paginationControl}

              {medias.length === 0 && (
                <Card className="text-center lead">
                  <Card.Body>Aucun fichier trouvé</Card.Body>
                </Card>
              )}
            </>
          )}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn-icon"
          variant="outline-danger"
          onClick={() => setShowModal(false)}
        >
          Annuler
        </Button>
        <Button
          className="btn-icon"
          variant="outline-success"
          type="submit"
          onClick={() => setMedia(selectedMedia)}
        >
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
