import { AssociationHome } from "../components/associations/Home";
import { AssociationSettings } from "../components/associations/settings/AssociationSettings";
import { Route } from "./global";
import { routes as eventsRoutes } from "./associations/events";
import { routes as libraryRoutes } from "./associations/library";
import { routes as marketplaceRoutes } from "./associations/marketplace";
import { routes as mediasRoutes } from "./associations/medias";
import { routes as pagesRoutes } from "./associations/pages";
import { routes as votesRoutes } from "./associations/votes";
import React from "react";
import { routes as rolesRoutes } from "./associations/roles";
import { AssociationBootstrap } from "../components/associations/Bootstrap";

export type AssociationRoute = Route & {
  props?: object;
  defaultLayout: boolean;
};

/**
 * Association routes are like common routes, with  one additional parameter,
 * which is `defaultLayout`. If `defaultLayout` is `true`, the `component` will
 * be automatically be wrapped in an `AssociationLayout`, which includes a sidebar
 * by default. If it's `false` it will not.
 * You may want to take advantage of it if :
 * - you want a custom sidebar, in that case you'll wrap your component with
 * `AssociationLayout` manually
 * - you don't want a sidebar at all, in that case you can organise your code as
 * usual
 */
export const routes: AssociationRoute[] = [
  {
    path: ``,
    component: AssociationHome,
    exact: true,
    defaultLayout: true,
  },
  {
    path: `/parametres`,
    component: AssociationSettings,
    exact: true,
    defaultLayout: true,
  },

  ...eventsRoutes,
  ...libraryRoutes,
  ...marketplaceRoutes,
  ...mediasRoutes,
  ...rolesRoutes,
  ...pagesRoutes,
  ...votesRoutes
];

export const compileAssociationRoutes = (routes: AssociationRoute[]): Route[] =>
  routes.map((route) => ({
    path: `/:associationId${route.path}`,
    component: (match) => (
      <AssociationBootstrap
        match={match}
        render={route.component}
        useDefaultLayout={route.defaultLayout}
        {...route.props}
      />
    ),
    exact: route.exact,
  }));
