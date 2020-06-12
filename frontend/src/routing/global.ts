import { Homepage } from "../components/Homepage";
import { AssociationList } from "../components/associations/List";
import { routes as usersRoutes } from "./users";
import {
    compileAssociationRoutes,
    routes as associationsRoutes,
} from "./associations";
import { PollsRouter } from "../components/polls/PollsRouter";

export type Route = {
    path: string;
    component: any;
    exact: boolean;
};

export const routes = [
    { path: "/", component: Homepage, exact: true },
    { path: "/associations", component: AssociationList, exact: true },
    {
        path: "/sondages",
        component: PollsRouter,
        exact: false,
    },
]
    .concat(compileAssociationRoutes("/associations", associationsRoutes))
    .concat(usersRoutes);

console.log(routes);
