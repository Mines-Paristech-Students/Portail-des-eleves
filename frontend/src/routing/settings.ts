import { Route } from "./global";
import { SettingsGlobal } from "../components/settings/SettingsGlobal";
import { SettingsAssociations } from "../components/settings/associations/SettingsAssociations";
import { SettingsUsers } from "../components/settings/SettingsUsers";
import { SettingsAssociationsEdit } from "../components/settings/associations/SettingsAssociationsEdit";
import { SettingsAssociationsAdd } from "../components/settings/associations/SettingsAssociationsAdd";

export const routes: Route[] = [
  {
    path: "",
    component: SettingsGlobal,
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
