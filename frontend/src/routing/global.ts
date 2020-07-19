import { Homepage } from "../components/Homepage";
import { AssociationList } from "../components/associations/List";
import { RepartitionList } from "../components/repartitions/List";
import { routes as usersRoutes } from "./users";
import { routes as pollsRoutes } from "./polls";
import { routes as repartitionViewRoutes } from "./repartitions";
import {
  compileRepartitionRoutes,
  routes as repartitionRoutes,
} from "./repartitionView";
import {
  compileAssociationRoutes,
  routes as associationsRoutes,
} from "./associations";

export const addRoutePrefix = (prefix: string, routes: Route[]): Route[] =>
  routes.map((route) => ({
    ...route,
    path: prefix + route.path,
  }));

export type Route = {
  path: string;
  component: any;
  exact: boolean;
};

export const routes = [
  { path: "/", component: Homepage, exact: true },
  { path: "/associations", component: AssociationList, exact: true },
  { path: "/repartitionView", component: RepartitionList, exact: true },
]
  .concat(
    addRoutePrefix(
      "/associations",
      compileAssociationRoutes(associationsRoutes)
    )
  )
  .concat(
    addRoutePrefix(
      "/repartitionView",
      compileRepartitionRoutes(repartitionRoutes)
    )
  )
  .concat(addRoutePrefix("/repartitions", repartitionViewRoutes))
  .concat(addRoutePrefix("/sondages", pollsRoutes))
  .concat(usersRoutes);
