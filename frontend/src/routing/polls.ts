import { ListPolls } from "../components/polls/list/ListPolls";
import { SubmitPoll } from "../components/polls/submit/SubmitPoll";
import { Route } from "./global";
import { PollsTableAdmin } from "../components/polls/table/PollsTableAdmin";
import { PollsTableUser } from "../components/polls/table/PollsTableUser";

export const routes: Route[] = [
    {
        path: "/sondages",
        component: () => ListPolls({ current: true }),
        exact: true,
    },
    {
        path: "/sondages/anciens",
        component: () => ListPolls({ current: false }),
        exact: true,
    },
    {
        path: "/sondages/administration",
        component: PollsTableAdmin,
        exact: true,
    },
    {
        path: "/sondages/mes-sondages",
        component: PollsTableUser,
        exact: true,
    },
    {
        path: "/sondages/proposer",
        component: SubmitPoll,
        exact: true,
    },
];
