import { Route } from "./global";
import { Groups } from "../components/repartitions/Groups";
import { OldRepartitions } from "../components/repartitions/OldRepartitions";
import { NewRepartition } from "../components/repartitions/NewRepartition";

export const routes: Route[] = [
  {
    path: "/oldrepartitions",
    component: OldRepartitions,
    exact: true,
  },
  {
    path: "/groups",
    component: Groups,
    exact: true,
  },
  {
    path: "/newrepartition",
    component: NewRepartition,
    exact: true,
  },
];
