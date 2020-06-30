import { api } from "../../services/apiService";
import Card from "react-bootstrap/Card";
import { Pagination } from "./Pagination";
import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Container } from "react-bootstrap";
import { MediaPreviewCard } from "../associations/medias/PreviewCard";
import { Media } from "../../models/associations/media";
import Button from "react-bootstrap/Button";
import { TagSearch } from "./tags/TagSearch";
import { SidebarSeparator } from "./sidebar/Sidebar";
import { SidebarDateSelector } from "./sidebar/SidebarDateSelector";
import { Association } from "../../models/associations/association";

/**
 * A generic way to select one (maybe more in the future) media from an
 * association media galery
 * @param association the association from which we want the medias
 * @param imageOnly if we want to only display  images
 * @param setMedia a callback called when the user validate a media
 * @param media the default media (can be null)
 * @param showModal determine whether the media selector be shown
 * @param setShowModal setter for `showModal`
 * @constructor
 */
export const MediaSelector = ({
  association,
  imageOnly,
  setMedia,
  media,
  showModal,
  setShowModal,
}: {
  association: Association;
  imageOnly: true;
  media: Media;
  setMedia: () => void;
  showModal: boolean;
  setShowModal: () => void;
}) => {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [tagParams, setTagParams] = useState({});
  const [dateParams, setDateParams] = useState({});

  useEffect(() => {
    setSelectedMedia(media);
  }, [media]);

  return (
    <Modal size="xl" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Body>
        <Row>
          <Col md={"3"}>
            <TagSearch
              tagsQueryParams={{
                page_size: 1000,
                namespace__scoped_to_model: "association",
                namespace__scoped_to_pk: association.id,
                related_to: "media",
                media__mimetype: imageOnly ? "image/png" : "",
              }}
              setTagParams={setTagParams}
            />
            <SidebarSeparator />
            <SidebarDateSelector
              association={association}
              setParams={setDateParams}
            />
          </Col>
          <Col md={"9"}>
            <Pagination
              apiKey={[
                "medias.list",
                association.id,
                {
                  page_size: 30,
                  mimetype__contains: imageOnly && "image",
                  ...tagParams,
                  ...dateParams,
                },
              ]}
              apiMethod={api.medias.list}
              render={(medias, paginationControl) => (
                <>
                  <Container>
                    {medias.map((media: Media) => (
                      <Col md={"4"} sm={"6"} key={media.id}>
                        <MediaPreviewCard
                          media={media}
                          showDescription={false}
                          overlayInformation={true}
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
                      </Col>
                    ))}
                  </Container>
                  {paginationControl}

                  {medias.length === 0 && (
                    <Card className="text-center lead">
                      <Card.Body>Aucun fichier trouvé</Card.Body>
                    </Card>
                  )}
                </>
              )}
            />
          </Col>
        </Row>
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
