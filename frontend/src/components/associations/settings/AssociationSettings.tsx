import React from "react";
import { AssociationNamespaceSettings } from "./AssociationNamespaceSettings";
import { PageTitle } from "../../utils/PageTitle";
import { AssociationLogoSettings } from "./AssociationLogoSettings";
import Container from "react-bootstrap/Container";

export const AssociationSettings = ({ association }) => (
  <Container className="mt-5">
    <PageTitle>Préférences</PageTitle>
    <AssociationNamespaceSettings association={association} />
    <AssociationLogoSettings association={association} />
  </Container>
);
