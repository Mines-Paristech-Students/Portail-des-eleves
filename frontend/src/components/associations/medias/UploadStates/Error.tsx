import Card from "react-bootstrap/Card";
import React from "react";

export const FileUploadError = ({ media, error }) => (
  <Card className={"mt-3"}>
    <Card.Header>
      <span role="img" aria-label="Une croix rouge">
        ❌
      </span>
      {media.name}
    </Card.Header>
    <Card.Body>
      <p className={"text-danger"}>{error}</p>
    </Card.Body>
  </Card>
);
