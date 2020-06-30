import Card from "react-bootstrap/Card";
import { TaggableModel, TagList } from "../../utils/tags/TagList";
import React from "react";
import { Media } from "../../../models/associations/media";

/**
 * Generic component to present a media in a card
 * @param media the media to display
 * @param showPreview show the preview
 * @param showDescription show the preview
 * @param showTags show the preview
 * @param onClick callback in case the card is clicked
 * @param props additional JSX props
 * @constructor
 */
export const MediaPreviewCard = ({
  media,
  showPreview = true,
  showDescription = true,
  showTags = true,
  onClick = () => {},
  ...props
}/* {
  media: Media;
  showPreview?: boolean;
  showDescription?: boolean;
  showTags?: boolean;
  onClick?: () => void;
}*/) => (
  <Card onClick={onClick} {...props}>

    {showPreview && media.previewUrl && (
      <img src={media.previewUrl} alt={media.name} />
    )}
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
  </Card>
);
