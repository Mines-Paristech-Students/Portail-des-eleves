import Card from "react-bootstrap/Card";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import React from "react";
import "./PreviewCard.css";
import dayjs from "dayjs";

/**
 * Generic component to present a media in a card
 * @param media the media to display
 * @param showPreview show the preview
 * @param showDescription show the preview
 * @param showTags show the preview
 * @param overlayInformation true to show the information on the image on hover
 * @param onClick callback in case the card is clicked
 * @param props additional JSX props
 * @constructor
 */
export const MediaPreviewCard = ({
  media,
  showPreview = true,
  showDescription = true,
  showTags = true,
  overlayInformation = false,
  onClick = () => {},
  ...props
}) => (
  <Card onClick={onClick} {...props}>
    {showPreview && media.previewUrl && (
      <div className={"text-white to-hover"}>
        <img className={"card-img"} src={media.previewUrl} alt={media.name} />
        {overlayInformation && (
          <div
            className="card-img-overlay to-show d-flex"
            style={{ justifyContent: "center" }}
          >
            <h4>{media.name}</h4>
            <p>{dayjs(media.uploadedOn).format("DD/DD/YYYY")}</p>
            <TagList
              model={TaggableModel.Media}
              instance={media}
              collapsed={true}
            />
          </div>
        )}
      </div>
    )}

    {!overlayInformation && (
      <>
        <Card.Body className={"border-top"}>
          <h4 className={"m-0"}>{media.name}</h4>
          {showDescription && <p className="text-muted">{media.description}</p>}
        </Card.Body>

        {showTags && media.tags.length > 0 && (
          <Card.Footer
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.03)",
            }}
          >
            <TagList
              model={TaggableModel.Media}
              instance={media}
              collapsed={true}
            />
          </Card.Footer>
        )}
      </>
    )}
  </Card>
);
