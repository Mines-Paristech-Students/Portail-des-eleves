import { Route } from "./global";
import { SettingsAssociations } from "../components/settings/associations/SettingsAssociations";
import { SettingsUsers } from "../components/settings/users/SettingsUsers";
import { SettingsAssociationsEdit } from "../components/settings/associations/SettingsAssociationsEdit";
import { SettingsAssociationsAdd } from "../components/settings/associations/SettingsAssociationsAdd";
import { Redirect } from "react-router";
import React from "react";
import { SettingsAssociationsAdministrators } from "../components/settings/associations/administrators/SettingsAssociationsAdministrators";
import { SettingsAssociationsAdministratorsAdd } from "../components/settings/associations/administrators/SettingsAssociationsAdministratorsAdd";

export const routes: Route[] = [
  {
    path: "",
    component: () => <Redirect to="/parametres/associations" />,
    exact: true,
  },
  {
    path: "/associations",
    component: SettingsAssociations,
    exact: true,
  },
  {
    path: "/associations/:associationId/modifier",
    component: SettingsAssociationsEdit,
    exact: true,
  },
  {
    path: "/associations/:associationId/administrateurs",
    component: SettingsAssociationsAdministrators,
    exact: true,
  },
  {
    path: "/associations/:associationId/administrateurs/ajouter",
    component: SettingsAssociationsAdministratorsAdd,
    exact: true,
  },
  {
    path: "/associations/creer",
    component: SettingsAssociationsAdd,
    exact: true,
  },
  {
    path: "/membres",
    component: SettingsUsers,
    exact: true,
  },
];
