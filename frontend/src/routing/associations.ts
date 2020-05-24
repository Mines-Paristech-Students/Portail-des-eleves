import { AssociationHome } from "../components/associations/Home";
import { AssociationShowPage } from "../components/associations/page/Show";
import {
    AssociationCreatePage,
    AssociationEditPage,
} from "../components/associations/page/Edit";
import { AssociationMarketplaceHome } from "../components/associations/marketplace/Home";
import { AssociationMarketplaceHistory } from "../components/associations/marketplace/History";
import { AssociationFilesystemList } from "../components/associations/medias/List";
import { AssociationFilesystemDetail } from "../components/associations/medias/Detail";
import { AssociationFilesystemEdit } from "../components/associations/medias/Edit";
import { AssociationFilesystemUpload } from "../components/associations/medias/Upload";
import { AssociationSettings } from "../components/associations/settings/AssociationSettings";
import { AssociationMarketplaceProductAdministration } from "../components/associations/marketplace/ProductsAdministration";
import { AssociationMarketplaceOrders } from "../components/associations/marketplace/Orders";
import { AssociationMarketplaceCounter } from "../components/associations/marketplace/Counter";
import { AssociationMarketplaceProductEdit } from "../components/associations/marketplace/ProductEdit";
import { Association } from "../models/associations/association";
import { Route } from "./global";

type AssociationRoute = Route & {
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
        path: `/pages/new`,
        component: AssociationCreatePage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId`,
        component: AssociationShowPage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/pages/:pageId/edit`,
        component: AssociationEditPage,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },

    {
        path: `/files`,
        component: AssociationFilesystemList,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
    {
        path: `/files/upload`,
        component: AssociationFilesystemUpload,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/files/:fileId`,
        component: AssociationFilesystemDetail,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/files/:fileId/edit`,
        component: AssociationFilesystemEdit,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },

    {
        path: `/marketplace`,
        component: AssociationMarketplaceHome,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/marketplace/history`,
        component: AssociationMarketplaceHistory,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },

    {
        path: `/marketplace/orders`,
        component: AssociationMarketplaceOrders,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/marketplace/counter`,
        component: AssociationMarketplaceCounter,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/marketplace/products`,
        component: AssociationMarketplaceProductAdministration,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/marketplace/products/:productId/edit`,
        component: AssociationMarketplaceProductEdit,
        exact: true,
        props: { association: association },
        defaultLayout: true
    },

    {
        path: `/parametres`,
        component: AssociationSettings,
        exact: true,
        props: { association: association },
        defaultLayout: true
    },
];
