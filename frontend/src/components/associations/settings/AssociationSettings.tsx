import React from "react";
import { AssociationNamespaceSettings } from "./AssociationNamespaceSettings";
import { PageTitle } from "../../utils/PageTitle";
import { AssociationLogoSettings } from "./AssociationLogoSettings";
import { AssociationOptInSettings } from "./AssociationOptInSettings";

export const AssociationSettings = ({ association }) => (
  <>
    <PageTitle>Préférences</PageTitle>
    <AssociationNamespaceSettings association={association} />
    <AssociationOptInSettings association={association}/>
    <AssociationLogoSettings association={association} />
  </>
);
