import {Route} from "./global";
import {Trombi} from "../components/users/trombi/Trombi";

export const routes: Route[] = [
    {
        path: "/trombi",
        component: Trombi,
        exact: true,
    },
];
