import { Route } from "./global";
import { SettingsGlobal } from "../components/settings/SettingsGlobal";
import { SettingsAssociation } from "../components/settings/SettingsAssociation";
import { SettingsUsers } from "../components/settings/SettingsUsers";

export const routes: Route[] = [
  {
    path: "",
    component: SettingsGlobal,
    exact: true,
  },
  {
    path: "/associations",
    component: SettingsAssociation,
    exact: true,
  },
  {
    path: "/membres",
    component: SettingsUsers,
    exact: true,
  },
];
