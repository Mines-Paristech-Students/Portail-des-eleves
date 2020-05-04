import { AssociationHome } from "../components/associations/Home";
import { AssociationShowPage } from "../components/associations/page/Show";
import {
    AssociationCreatePage,
    AssociationEditPage
} from "../components/associations/page/Edit";
import { AssociationMarketplaceHome } from "../components/associations/marketplace/Home";
import { AssociationMarketplaceHistory } from "../components/associations/marketplace/History";
import { AssociationFilesystemList } from "../components/associations/medias/List";
import { AssociationFilesystemDetail } from "../components/associations/medias/Detail";
import { AssociationFilesystemEdit } from "../components/associations/medias/Edit";
import { AssociationFilesystemUpload } from "../components/associations/medias/Upload";

export const routes = association => [
    {
        path: `/`,
        component: AssociationHome,
        exact: true,
        props: { association: association }
    },
    {
        path: `/pages/new`,
        component: AssociationCreatePage,
        exact: true,
        props: { association: association }
    },
    {
        path: `/pages/:pageId`,
        component: AssociationShowPage,
        exact: true,
        props: { association: association }
    },
    {
        path: `/pages/:pageId/edit`,
        component: AssociationEditPage,
        exact: true,
        props: { association: association }
    },

    {
        path: `/files`,
        component: AssociationFilesystemList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/files/upload`,
        component: AssociationFilesystemUpload,
        exact: true,
        props: { association: association }
    },
    {
        path: `/files/:fileId`,
        component: AssociationFilesystemDetail,
        exact: true,
        props: { association: association }
    },
    {
        path: `/files/:fileId/edit`,
        component: AssociationFilesystemEdit,
        exact: true,
        props: { association: association }
    },

    {
        path: `/marketplace`,
        component: AssociationMarketplaceHome,
        exact: true,
        props: { association: association }
    },

    {
        path: `/marketplace/history`,
        component: AssociationMarketplaceHistory,
        exact: true,
        props: { association: association }
    }
];
