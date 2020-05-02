import { Homepage } from "../pages/Homepage";
import { AssociationList } from "../pages/associations/List";
import { AssociationMain } from "../pages/associations/Main";
import { CourseList } from "../pages/courses/List";

export const routes = [
    { path: "/", component: Homepage, exact: true },
    { path: "/associations", component: AssociationList, exact: true },
    {
        path: "/associations/:associationId",
        component: AssociationMain,
        exact: false
    },
    { path: "/courses", component: CourseList, exact: true },
];
