import { Route } from "./global";
import { UserProfile } from "../components/user/profile/UserProfile";
import { Trombi } from "../components/user/trombi/Trombi";

export const routes: Route[] = [
    {
        path: "/trombi",
        component: Trombi,
        exact: true,
    },
    {
        path: `/profils/modifier`,
        component: UserProfile,
        exact: true,
    },
    {
        path: `/profils/:userId`,
        component: UserProfile,
        exact: true,
    },
];
