import { Homepage } from "../components/Homepage";
import { AssociationList } from "../components/associations/List";
import { routes as usersRoutes } from "./users";
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
]
    .concat(
        addRoutePrefix(
            "/associations",
            compileAssociationRoutes(associationsRoutes)
        )
    )
    .concat(addRoutePrefix("/sondages", pollsRoutes))
    .concat(usersRoutes);

routes.forEach((r) => console.log(r.path));
