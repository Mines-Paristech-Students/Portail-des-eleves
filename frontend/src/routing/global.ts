import { Homepage } from "../components/Homepage";
import { AssociationList } from "../components/associations/List";
import { AssociationRouter } from "../components/associations/Router";
import { routes as usersRoutes } from "./users";
import { CourseList } from "../components/courses/List";
import { CourseRouter } from "../components/courses/Router";
import { PollsRouter } from "../components/polls/Router";

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
        component: AssociationRouter,
        exact: false,
    },
    { path: "/cours", component: CourseList, exact: true },
    {
        path: "/cours/:courseId",
        component: CourseRouter,
        exact: false,
    },
    {
        path: "/sondages",
        component: PollsRouter,
        exact: false,
    },
].concat(usersRoutes);
