import { AssociationHome } from "../pages/associations/Home";
import { AssociationShowPage } from "../pages/associations/page/Show";
import {
    AssociationCreatePage,
    AssociationEditPage
} from "../pages/associations/page/Edit";
import { AssociationFilesystemList } from "../pages/associations/files/List";
import { AssociationFilesystemDetail } from "../pages/associations/files/Detail";
import { AssociationFilesystemEdit } from "../pages/associations/files/Edit";
import { AssociationFilesystemUpload } from "../pages/associations/files/Upload";

// To be replaced
import { AssociationListEvent } from "../pages/associations/events/List";
import { AssociationCreateEvent, AssociationEditEvent, AssociationShowEvent } from "../pages/associations/events/Plop";

export const routes = association => [
    {
        path: `/`,
        component: AssociationHome,
        exact: true,
        props: { association: association }
    },
    {
        path: `/events/`,
        component: AssociationListEvent,
        exact: true,
        props: { association: association }
    },
    {
        path: `/events/new`,
        component: AssociationCreateEvent,
        exact: true,
        props: { association: association }
    },
    {
        path: `/events/:eventId`,
        component: AssociationShowEvent,
        exact: true,
        props: { association: association }
    },
    {
        path: `/events/:eventId/edit`,
        component: AssociationEditEvent,
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
    }
];
