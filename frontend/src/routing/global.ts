import { Homepage } from "../pages/homepage";
import { AssociationList } from "../pages/associations/list";
import { AssociationMain } from "../pages/associations/main";

export const routes = [
    { path: "/", component: Homepage, exact: true },
    { path: "/associations", component: AssociationList, exact: true },
    {
        path: "/associations/:associationId",
        component: AssociationMain,
        exact: false
    }
];