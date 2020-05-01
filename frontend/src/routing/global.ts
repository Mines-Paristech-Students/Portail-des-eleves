import { Homepage } from "../pages/Homepage";
import { AssociationList } from "../pages/associations/List";
import { AssociationMain } from "../pages/associations/Main";
import { routes as pollsRoutes } from "./polls";

export type Route = {
    path: string;
    component: any;
    exact: boolean;
};

export const routes = [
    { path: "/", component: Homepage, exact: true },
    { path: "/associations", component: AssociationList, exact: true },
    {
        path: "/associations/:associationId",
        component: AssociationMain,
        exact: false
    }
].concat(pollsRoutes);
