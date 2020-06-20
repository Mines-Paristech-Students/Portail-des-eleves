import { Route } from "./global";
import { RepartitionsHome } from "../components/repartitions/Home";
import { Nouveau } from "../components/repartitions/Nouveau";
import { Anciens } from "../components/repartitions/Anciens";

export const routes: Route[] = [
{
  path: "/Anciens",
  component: Anciens,
  exact: true,
},
{
  path: "/Nouveau",
  component: Nouveau,
  exact: true,
},
  {
    path: ``,
    component: RepartitionsHome,
    exact: true,
  },
];