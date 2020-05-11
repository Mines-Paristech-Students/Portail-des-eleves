import { AssociationHome } from "../pages/associations/Home";
import { AssociationShowPage } from "../pages/associations/page/Show";
import {
    AssociationCreatePage,
    AssociationEditPage
} from "../pages/associations/page/Edit";
import { AssociationFilesystemList } from "../pages/associations/medias/List";
import { AssociationFilesystemDetail } from "../pages/associations/medias/Detail";
import { AssociationFilesystemEdit } from "../pages/associations/medias/Edit";
import { AssociationFilesystemUpload } from "../pages/associations/medias/Upload";

// To be replaced
import { AssociationEventList } from "../pages/associations/events/List";
import { AssociationEventCreate, AssociationEventEdit } from "../pages/associations/events/Edit";

export const routes = association => [
    {
        path: `/`,
        component: AssociationHome,
        exact: true,
        props: { association: association }
    },
    {
        path: `/evenements/`,
        component: AssociationEventList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/evenements/nouveau`,
        component: AssociationEventCreate,
        exact: true,
        props: { association: association }
    },
    {
        path: `/evenements/:eventId/modifier`,
        component: AssociationEventEdit,
        exact: true,
        props: { association: association }
    },
    {
        path: `/pages/nouveau`,
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
        path: `/pages/:pageId/editer`,
        component: AssociationEditPage,
        exact: true,
        props: { association: association }
    },

    {
        path: `/fichiers`,
        component: AssociationFilesystemList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/fichiers/telecharger`,
        component: AssociationFilesystemUpload,
        exact: true,
        props: { association: association }
    },
    {
        path: `/fichiers/:fileId`,
        component: AssociationFilesystemDetail,
        exact: true,
        props: { association: association }
    },
    {
        path: `/fichiers/:fileId/modifier`,
        component: AssociationFilesystemEdit,
        exact: true,
        props: { association: association }
    }
];
