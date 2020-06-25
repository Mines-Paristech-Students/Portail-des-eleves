import { Homepage } from "../components/Homepage";
import { AssociationList } from "../components/associations/List";
import { routes as usersRoutes } from "./users";
import { CourseList } from "../components/courses/List";
import { FormRouter } from "../components/courses/forms/Route";
import { CourseRouter } from "../components/courses/Router";
import { routes as pollsRoutes } from "./polls";
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
  { path: "/cours", component: CourseList, exact: true },
  { path: "/cours/formulaires", component: FormRouter, exact: false },
  {
    path: "/cours/:courseId",
    component: CourseRouter,
    exact: false,
  },
]
  .concat(
    addRoutePrefix(
      "/associations",
      compileAssociationRoutes(associationsRoutes)
    )
  )
  .concat(addRoutePrefix("/sondages", pollsRoutes))
  .concat(usersRoutes);
