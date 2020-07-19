import { Route } from "./global";
import { RepartitionList } from "../components/repartitions/List";
import { RepartitionTitle } from "../components/repartitions/RepartitionTitle";
import { RepartitionEdit } from "../components/repartitions/RepartitionEdit";
import { RepartitionBootstrap } from "../components/repartitions/Bootstrap";
import React from "react";

export type RepartitionRoute = Route & {
  props?: object;
};

export const routes: Route[] = [
  {
    path: ``,
    component: RepartitionTitle,
    exact: true,
  },
  {
    path: `/liste`,
    component: RepartitionList,
    exact: true,
  },
  {
    path: `/modifier`,
    component: RepartitionEdit,
    exact: true,
  },
];

export const compileRepartitionRoutes = (routes: RepartitionRoute[]): Route[] =>
  routes.map((route) => ({
    path: `/:repartitionId${route.path}`,
    component: (match) => (
      <RepartitionBootstrap
        render={route.component}
        match={match}
        {...route.props}
      />
    ),
    exact: route.exact,
  }));
