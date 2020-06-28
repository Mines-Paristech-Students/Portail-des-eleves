import { Card } from "react-bootstrap";
import React from "react";

export const AssociationLogoSettings = ({ association }) => (
  <Card>
    <Card.Header>
      <Card.Title>Logo</Card.Title>
    </Card.Header>
    {association.logo && (
      <img src={association.logo} alt="Logo de l'association" />
    )}
    <Card.Body></Card.Body>
  </Card>
);
