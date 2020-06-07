import { AssociationHome } from "../components/associations/Home";
import { AssociationSettings } from "../components/associations/settings/AssociationSettings";
import { Association } from "../models/associations/association";
import { Route } from "./global";
import { routes as eventsRoutes } from "./associations/events";
import { routes as marketplaceRoutes } from "./associations/marketplace";
import { routes as mediasRoutes } from "./associations/medias";
import { routes as rolesRoutes } from "./associations/roles";
import { routes as pagesRoutes } from "./associations/pages";

export type AssociationRoute = Route & {
    props: object;
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
export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/`,
        component: AssociationHome,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/parametres`,
        component: AssociationSettings,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },

    ...eventsRoutes(association),
    ...marketplaceRoutes(association),
    ...mediasRoutes(association),
    ...rolesRoutes(association),
    ...pagesRoutes(association),
];
