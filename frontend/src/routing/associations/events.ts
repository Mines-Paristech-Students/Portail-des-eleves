import { Association } from "../../models/associations/association";
import { AssociationRoute } from "../associations";
import { AssociationListEvents } from "../../components/associations/events/list/AssociationListEvents";
import { AssociationCreateEvent } from "../../components/associations/events/create/AssociationCreateEvent";
import { AssociationEditEvent } from "../../components/associations/events/edit/AssociationEditEvent";

export const routes: (association: Association) => AssociationRoute[] = (
    association
) => [
    {
        path: `/evenements`,
        component: AssociationListEvents,
        exact: true,
        props: {
            association: association,
            title: "Événements à venir",
            apiParameters: {
                time: ["NOW", "AFTER"],
                ordering: "starts_at",
            },
        },
        defaultLayout: true,
    },
    {
        path: `/evenements/passes`,
        component: AssociationListEvents,
        exact: true,
        props: {
            association: association,
            title: "Événements passés",
            apiParameters: {
                time: ["BEFORE"],
                ordering: "-starts_at",
            },
        },
        defaultLayout: true,
    },
    {
        path: `/evenements/creer`,
        component: AssociationCreateEvent,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
    {
        path: `/evenements/:eventId/modifier`,
        component: AssociationEditEvent,
        exact: true,
        props: { association: association },
        defaultLayout: true,
    },
];
