import { AssociationHome } from "../pages/associations/Home";
import { AssociationShowPage } from "../pages/associations/page/Show";
import {
    AssociationCreatePage,
    AssociationEditPage
} from "../pages/associations/page/Edit";
import { AssociationMarketplaceHome } from "../pages/associations/marketplace/Home";
import { AssociationMarketplaceHistory } from "../pages/associations/marketplace/History";
import { AssociationFilesystemList } from "../pages/associations/medias/List";
import { AssociationFilesystemDetail } from "../pages/associations/medias/Detail";
import { AssociationFilesystemEdit } from "../pages/associations/medias/Edit";
import { AssociationFilesystemUpload } from "../pages/associations/medias/Upload";
import { AssociationElectionActiveList } from "../pages/associations/elections/ActiveList";
import { AssociationElectionResultsList } from "../pages/associations/elections/ResultsList";
import { AssociationElectionUpcomingList } from "../pages/associations/elections/UpcomingList";
import {AssociationCreateElection, AssociationEditElection} from "../pages/associations/elections/Edit";


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
        path: `/elections-en-cours`,
        component: AssociationElectionActiveList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/elections-passees`,
        component: AssociationElectionResultsList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/elections-a-venir`,
        component: AssociationElectionUpcomingList,
        exact: true,
        props: { association: association }
    },
    {
        path: `/elections/nouvelle`,
        component: AssociationCreateElection,
        exact: true,
        props: { association: association }
    },
    {
        path: `/elections/:electionId/modifier`,
        component: AssociationEditElection,
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
