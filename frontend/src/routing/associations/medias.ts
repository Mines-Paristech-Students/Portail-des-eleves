import { AssociationRoute } from "../associations";
import { AssociationFilesystemList } from "../../components/associations/medias/List";
import { AssociationFilesystemDetail } from "../../components/associations/medias/Detail";
import { AssociationFilesystemUpload } from "../../components/associations/medias/Upload";
import { AssociationFilesystemEdit } from "../../components/associations/medias/Edit";

export const routes: AssociationRoute[] = [
    {
        path: `/fichiers`,
        component: AssociationFilesystemList,
        exact: true,
        defaultLayout: false,
    },
    {
        path: `/fichiers/televerser`,
        component: AssociationFilesystemUpload,
        exact: true,
        defaultLayout: true,
    },
    {
        path: `/fichiers/:fileId`,
        component: AssociationFilesystemDetail,
        exact: true,
        defaultLayout: true,
    },
    {
        path: `/fichiers/:fileId/modifier`,
        component: AssociationFilesystemEdit,
        exact: true,
        defaultLayout: true,
    },
];
