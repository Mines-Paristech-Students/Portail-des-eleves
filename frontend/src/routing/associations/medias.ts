import { AssociationRoute } from "../associations";
import { AssociationFilesystemList } from "../../components/associations/medias/List";
import { Association } from "../../models/associations/association";
import { AssociationFilesystemDetail } from "../../components/associations/medias/Detail";
import { AssociationFilesystemUpload } from "../../components/associations/medias/Upload";
import { AssociationFilesystemEdit } from "../../components/associations/medias/Edit";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/fichiers`,
        component: AssociationFilesystemList,
        exact: true,
        props: { association: association },
        defaultLayout: false,
    },
    {
        path: `/fichiers/televerser`,
        component: AssociationFilesystemUpload,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/fichiers/:fileId`,
        component: AssociationFilesystemDetail,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/fichiers/:fileId/modifier`,
        component: AssociationFilesystemEdit,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
];
