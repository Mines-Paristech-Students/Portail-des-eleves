import React from "react";
import Card from "react-bootstrap/Card";
import { Page } from "../../../../models/associations/page";
import ReactMarkdown from "react-markdown";
import { Link } from "react-router-dom";
import { Association } from "../../../../models/associations/association";

export const AssociationPageCard = ({
  association,
  page,
}: {
  association: Association;
  page: Page;
}) => (
  <Card>
    <Card.Header>
      <Card.Title>{page.title}</Card.Title>

      <div className="card-options">
        <Link
          to={`/associations/${association.id}/pages/${page.id}/modifier`}
          className={"btn btn-primary btn-sm"}
        >
          Modifier
        </Link>
      </div>
    </Card.Header>
    <Card.Body>
      <ReactMarkdown source={page.text} />
    </Card.Body>
  </Card>
);
