import React from "react";
import { AssociationNamespaceSettings } from "./AssociationNamespaceSettings";
import { PageTitle } from "../../utils/PageTitle";
import { AssociationLogoSettings } from "./AssociationLogoSettings";

export const AssociationSettings = ({ association }) => (
  <>
    <PageTitle>Préférences</PageTitle>
    <AssociationNamespaceSettings association={association} />
    <AssociationLogoSettings association={association} />
  </>
);
