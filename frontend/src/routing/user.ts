import { Route } from "./global";
import { UserProfile } from "../components/user/profile/UserProfile";

export const routes: Route[] = [
    {
        path: `/profils/:userId`,
        component: UserProfile,
        exact: true,
    },
    {
        path: `/profils/modifier`,
        component: UserProfile,
        exact: true,
    },
];
